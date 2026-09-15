import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import { Button, Card, CardContent, Spinner, Step, StepLabel, Stepper } from '@devclub/ui'

import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'

import { diplomaAPI } from '../../../services/api'
import { diplomaKeys } from '../../../config/quiz'
import { HandleAxiosAndGenericError, ToastifyDisplay } from '../../../utils'
import type {
  DiplomaAnswersPayload,
  DiplomaAnswersResponse,
  DiplomaAttemptPayload,
  DiplomaAttemptResponse,
  DiplomaLeadPayload,
  DiplomaPublicConfig,
  DiplomaSessionResponse,
} from '../../../types/diploma'

import { LeadStep, emptyLead, type LeadValues } from './steps/LeadStep'
import { FeedbackStep, isQuestionAnswered, type DraftAnswers } from './steps/FeedbackStep'
import { MbaStep, emptyMbaDraft, type MbaDraft } from './steps/MbaStep'
import { KeywordsStep } from './steps/KeywordsStep'
import { DoneStep } from './steps/DoneStep'

type FlowStep = 'lead' | 'feedback' | 'mba' | 'keywords' | 'done'

interface Session {
  submissionId: string
  name: string
  certificateUrl?: string
}

const NOT_FOUND_EVENT = 'Evento não encontrado.'

const statusOf = (error: unknown): number | undefined => (axios.isAxiosError(error) ? error.response?.status : undefined)

// O handler genérico troca a mensagem de 404 por um texto genérico; os status que
// importam para o fluxo (404, 409, 429, 400) são tratados aqui ou por quem chama.
async function errorMessage(error: unknown): Promise<string> {
  if (statusOf(error) === 429) return 'Aguarde um instante e tente novamente.'
  return HandleAxiosAndGenericError(error)
}

const toastError = (message: string) => ToastifyDisplay({ toastType: 'error', message })()

// Descarta do rascunho tudo que não bate mais com as perguntas/opções atuais,
// sem perder o que ainda vale (config editada pelo admin ou localStorage antigo).
function sanitizeDraft(cfg: DiplomaPublicConfig, answers: Record<string, unknown>, mba: Partial<MbaDraft>): { answers: DraftAnswers; mba: MbaDraft } {
  const nextAnswers: DraftAnswers = {}
  cfg.questions.forEach(question => {
    const value = answers[question.id]
    if (question.type === 'nps') {
      if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 10) nextAnswers[question.id] = value
      return
    }
    const optionIds = new Set((question.options ?? []).map(option => option.id))
    const ids = Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string' && optionIds.has(id)) : []
    if (ids.length) nextAnswers[question.id] = ids
  })

  const intent = typeof mba.intent === 'boolean' ? mba.intent : null
  const reasonOptions = intent === null ? [] : intent ? cfg.mba.yesOptions : cfg.mba.noOptions
  const reasonIds = new Set(reasonOptions.map(option => option.id))

  return {
    answers: nextAnswers,
    mba: {
      intent,
      reasons: Array.isArray(mba.reasons) ? mba.reasons.filter(id => reasonIds.has(id)) : [],
      otherChecked: intent !== null && mba.otherChecked === true,
      other: typeof mba.other === 'string' ? mba.other.slice(0, 500) : '',
    },
  }
}

function readDraft(eventId: string): { answers: Record<string, unknown>; mba: Partial<MbaDraft> } {
  try {
    const parsed = JSON.parse(localStorage.getItem(diplomaKeys(eventId).draft) || '{}')
    return {
      answers: parsed?.answers && typeof parsed.answers === 'object' ? parsed.answers : {},
      mba: parsed?.mba && typeof parsed.mba === 'object' ? parsed.mba : {},
    }
  } catch {
    return { answers: {}, mba: {} }
  }
}

async function fetchSubmission(submissionId: string): Promise<DiplomaSessionResponse | null> {
  try {
    const { data } = await diplomaAPI.get<DiplomaSessionResponse>(`/public/diploma/submissions/${submissionId}`)
    return data
  } catch {
    return null
  }
}

export function DiplomaPage() {
  const { slug = '' } = useParams()

  const [config, setConfig] = useState<DiplomaPublicConfig | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)

  const [step, setStep] = useState<FlowStep>('lead')
  const [session, setSession] = useState<Session | null>(null)
  // Dados do formulário só em memória, para preencher de novo ao "editar" o nome.
  const [lead, setLead] = useState<LeadValues | null>(null)
  const [answers, setAnswers] = useState<DraftAnswers>({})
  const [mba, setMba] = useState<MbaDraft>(emptyMbaDraft)

  const keys = config ? diplomaKeys(config.id) : null

  // Alinha a tela com a etapa que o servidor devolveu.
  const applySession = (data: DiplomaSessionResponse, cfg: DiplomaPublicConfig) => {
    setSession({ submissionId: data.submissionId, name: data.name, certificateUrl: data.certificateUrl })
    if (data.step === 'done') localStorage.removeItem(diplomaKeys(cfg.id).draft)
    setStep(data.step === 'feedback' && !cfg.questions.length ? 'mba' : data.step)
  }

  // Carrega a config pelo slug e, se este navegador já tem uma submissão, retoma de onde parou.
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const { data: cfg } = await diplomaAPI.get<DiplomaPublicConfig>(`/public/diploma/${slug}`)
        if (cancelled) return
        const stored = readDraft(cfg.id)
        const draft = sanitizeDraft(cfg, stored.answers, stored.mba)
        setConfig(cfg)
        setLoadError(null)
        setAnswers(draft.answers)
        setMba(draft.mba)

        // Evento encerrado não bloqueia a retomada: quem já passou continua baixando o diploma.
        const cfgKeys = diplomaKeys(cfg.id)
        const storedId = localStorage.getItem(cfgKeys.submissionId)
        if (!storedId) return
        try {
          const { data } = await diplomaAPI.get<DiplomaSessionResponse>(`/public/diploma/submissions/${storedId}`)
          if (!cancelled) applySession(data, cfg)
        } catch (error) {
          if (cancelled) return
          if (statusOf(error) === 404) {
            // Submissão apagada (ex.: envio de teste excluído no admin): recomeça do zero.
            localStorage.removeItem(cfgKeys.submissionId)
            localStorage.removeItem(cfgKeys.draft)
            setAnswers({})
            setMba(emptyMbaDraft)
          } else {
            toastError(await errorMessage(error))
          }
        }
      } catch (error) {
        if (cancelled) return
        setConfig(null)
        setLoadError(statusOf(error) === 404 ? NOT_FOUND_EVENT : await errorMessage(error))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [slug])

  // O rascunho sobrevive a refresh. Não grava antes do lead nem depois de passar.
  useEffect(() => {
    if (!config || step === 'lead' || step === 'done') return
    localStorage.setItem(diplomaKeys(config.id).draft, JSON.stringify({ answers, mba }))
  }, [config, step, answers, mba])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  // Recarrega a config (admin editou o formulário ou encerrou o evento) mantendo o rascunho que ainda vale.
  const refreshConfig = async (): Promise<{ cfg: DiplomaPublicConfig; answers: DraftAnswers } | null> => {
    try {
      const { data: cfg } = await diplomaAPI.get<DiplomaPublicConfig>(`/public/diploma/${slug}`)
      const draft = sanitizeDraft(cfg, answers, mba)
      setConfig(cfg)
      setAnswers(draft.answers)
      setMba(draft.mba)
      return { cfg, answers: draft.answers }
    } catch (error) {
      toastError(statusOf(error) === 404 ? NOT_FOUND_EVENT : await errorMessage(error))
      return null
    }
  }

  // A submissão sumiu do servidor: volta para os dados, mantendo o rascunho das respostas.
  const dropSubmission = () => {
    if (keys) localStorage.removeItem(keys.submissionId)
    setSession(null)
    setStep('lead')
    ToastifyDisplay({ toastType: 'warning', message: 'Não encontramos sua participação. Preencha seus dados novamente.' })()
  }

  const handleRestart = () => {
    if (keys) {
      localStorage.removeItem(keys.submissionId)
      localStorage.removeItem(keys.draft)
    }
    setSession(null)
    setLead(null)
    setAnswers({})
    setMba(emptyMbaDraft)
    setStep('lead')
  }

  const handleLead = async (values: LeadValues): Promise<void> => {
    if (!config || !keys) return

    // Telefone vai como digitado: o servidor guarda só os dígitos.
    const payload: DiplomaLeadPayload = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.isForeigner ? values.foreignPhone : values.brPhone,
      doLiveAbroad: values.isForeigner,
      consent: values.consent,
    }

    setSubmitting(true)
    try {
      const { data } = await diplomaAPI.post<DiplomaSessionResponse>(`/public/diploma/${config.slug}/submissions`, payload)
      localStorage.setItem(keys.submissionId, data.submissionId)
      setLead(values)
      applySession(data, config)
    } catch (error) {
      const status = statusOf(error)
      toastError(status === 404 ? NOT_FOUND_EVENT : await errorMessage(error))
      // 403 = evento encerrado depois que a página abriu: atualiza para mostrar o aviso.
      if (status === 403) await refreshConfig()
    } finally {
      setSubmitting(false)
    }
  }

  const handleAnswers = async (): Promise<void> => {
    if (!config || !session) return

    const payload: DiplomaAnswersPayload = {
      answers: config.questions.map(question => {
        const value = answers[question.id]
        return question.type === 'nps' ? { questionId: question.id, score: value as number } : { questionId: question.id, optionIds: value as string[] }
      }),
      mba: { intent: Boolean(mba.intent), reasons: mba.reasons, other: mba.otherChecked ? mba.other.trim() : null },
    }

    setSubmitting(true)
    try {
      const { data } = await diplomaAPI.put<DiplomaAnswersResponse>(`/public/diploma/submissions/${session.submissionId}/answers`, payload)
      setConfig(prev => (prev ? { ...prev, keywordCount: data.keywordCount } : prev))
      setStep('keywords')
    } catch (error) {
      const status = statusOf(error)
      if (status === 404) {
        dropSubmission()
        return
      }
      toastError(await errorMessage(error))
      if (status === 409) {
        // Ou já passou (ex.: em outro aparelho), ou o formulário mudou no admin.
        const current = await fetchSubmission(session.submissionId)
        if (current?.step === 'done') {
          applySession(current, config)
          return
        }
        const refreshed = await refreshConfig()
        if (refreshed?.cfg.questions.some(question => !isQuestionAnswered(question, refreshed.answers[question.id]))) setStep('feedback')
      } else if (status === 403) {
        await refreshConfig()
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleAttempt = async (keywords: string[]): Promise<DiplomaAttemptResponse | null> => {
    if (!config || !session || !keys) return null

    const payload: DiplomaAttemptPayload = { keywords }

    setSubmitting(true)
    try {
      const { data } = await diplomaAPI.post<DiplomaAttemptResponse>(`/public/diploma/submissions/${session.submissionId}/attempts`, payload)
      if (data.passed) {
        localStorage.removeItem(keys.draft)
        setSession({ ...session, certificateUrl: data.certificateUrl })
        setStep('done')
      }
      return data
    } catch (error) {
      const status = statusOf(error)
      if (status === 404) {
        dropSubmission()
        return null
      }
      toastError(await errorMessage(error))
      const keywordCount = axios.isAxiosError(error) ? error.response?.data?.keywordCount : undefined
      if ((status === 400 && typeof keywordCount === 'number') || status === 403) {
        // Quantidade de palavras mudou no admin, ou o evento foi encerrado.
        await refreshConfig()
      } else if (status === 409) {
        // Sem respostas registradas: volta para a etapa que o servidor indicar.
        const current = await fetchSubmission(session.submissionId)
        if (current) applySession(current, config)
      }
      return null
    } finally {
      setSubmitting(false)
    }
  }

  const flowSteps: Array<{ key: FlowStep; label: string }> = [
    { key: 'lead', label: 'Dados' },
    ...(config?.questions.length ? [{ key: 'feedback' as const, label: 'Avaliação' }] : []),
    { key: 'mba', label: 'MBA' },
    { key: 'keywords', label: 'Palavras-chave' },
    { key: 'done', label: 'Diploma' },
  ]
  // Editando o nome a partir das palavras-chave, a trilha continua mostrando o progresso real.
  const progressStep: FlowStep = step === 'lead' && session ? 'keywords' : step
  const currentIndex = Math.max(
    0,
    flowSteps.findIndex(flowStep => flowStep.key === progressStep),
  )

  const renderStep = () => {
    if (!config) return null
    // Sem submissão só existe a etapa de dados.
    const activeStep: FlowStep = session ? step : 'lead'

    switch (activeStep) {
      case 'lead':
        return (
          <LeadStep
            initial={lead ?? (session ? { ...emptyLead, name: session.name } : emptyLead)}
            loading={submitting}
            onSubmit={handleLead}
            onCancel={session ? () => setStep('keywords') : undefined}
          />
        )
      case 'feedback':
        return (
          <FeedbackStep
            questions={config.questions}
            answers={answers}
            onChange={(id, value) => setAnswers(prev => ({ ...prev, [id]: value }))}
            onNext={() => setStep('mba')}
          />
        )
      case 'mba':
        return (
          <MbaStep
            mba={config.mba}
            value={mba}
            loading={submitting}
            onChange={setMba}
            onSubmit={handleAnswers}
            onBack={config.questions.length ? () => setStep('feedback') : undefined}
          />
        )
      case 'keywords':
        return (
          <KeywordsStep
            keywordCount={config.keywordCount}
            name={session?.name ?? ''}
            loading={submitting}
            onSubmit={handleAttempt}
            onEditName={() => setStep('lead')}
          />
        )
      case 'done':
        return <DoneStep name={session?.name ?? ''} eventName={config.name} certificateUrl={session?.certificateUrl} />
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />

      <main className="w-full flex-grow">
        <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-6 md:pt-10">
          {loading ? (
            <div className="text-fg-brand flex justify-center py-16">
              <Spinner className="size-8" />
            </div>
          ) : !config ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-2 pt-6 text-center">
                <p className="font-display text-h5 text-fg">{loadError ?? NOT_FOUND_EVENT}</p>
                {loadError === NOT_FOUND_EVENT && <p className="text-copy-sm text-fg-subtle">Confira se o link está correto.</p>}
              </CardContent>
            </Card>
          ) : (
            <>
              <div>
                <p className="font-pixel text-eyebrow tracking-caps text-fg-brand uppercase">Diploma do evento</p>
                <h1 className="font-display text-h4 text-fg md:text-h3 mt-1">{config.name}</h1>
              </div>

              {!config.isActive && step !== 'done' && (
                <div className="border-error-line bg-error-bg rounded-lg border px-4 py-3">
                  <p className="text-copy-sm text-error-fg font-semibold">🔒 As participações deste evento foram encerradas.</p>
                  {!session && (
                    <p className="text-copy-sm text-error-fg mt-1">Se você já emitiu o seu diploma, informe os mesmos dados para baixá-lo novamente.</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Stepper aria-label="Etapas do diploma">
                  {flowSteps.map((flowStep, index) => {
                    const status = progressStep === 'done' || index < currentIndex ? 'completed' : index === currentIndex ? 'current' : 'pending'
                    return (
                      <Step key={flowStep.key} status={status} aria-current={status === 'current' ? 'step' : undefined}>
                        <StepLabel className="text-label-sm hidden sm:block">{flowStep.label}</StepLabel>
                      </Step>
                    )
                  })}
                </Stepper>
                <p className="text-label-sm text-fg-subtle text-center sm:hidden">
                  Etapa {currentIndex + 1} de {flowSteps.length} · {flowSteps[currentIndex].label}
                </p>
              </div>

              {session && step !== 'lead' && (
                <p className="text-copy-sm text-fg-subtle flex flex-wrap items-center gap-x-2">
                  <span>
                    Participando como <b className="text-fg font-semibold">{session.name}</b>.
                  </span>
                  <Button type="button" variant="link" size="sm" onClick={handleRestart} disabled={submitting} className="h-auto px-0">
                    Não é você? Recomeçar
                  </Button>
                </p>
              )}

              {renderStep()}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
