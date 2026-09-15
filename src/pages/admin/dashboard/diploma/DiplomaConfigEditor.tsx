import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle, Badge, Button, Card, CardContent, CardHeader, CardTitle, IconButton, Input, Label } from '@devclub/ui'

import { quizAdminAPI } from '../../../../services/api'
import { DiplomaConfig, DiplomaQuestionType } from '../../../../types/diploma'
import { HandleAxiosAndGenericError, ToastifyDisplay } from '../../../../utils'
import { DiplomaDraft, DraftQuestion, emptyOption, moveItem, newKey, toDraft, toPayload, validateDraft } from '../../../../utils/diploma'
import { KeywordsEditor } from './KeywordsEditor'
import { OptionListEditor } from './OptionListEditor'

interface DiplomaConfigEditorProps {
  eventId: string
  isActive: boolean
  token?: string
  config: DiplomaConfig
  onSaved: (config: DiplomaConfig) => void
}

const selectClass = 'rounded-md border border-line bg-component px-3 py-2 text-copy-sm text-fg outline-none focus:border-brand'

function SectionHeader({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-col">
        <h3 className="text-h5 text-fg font-semibold">{title}</h3>
        <p className="text-copy-sm text-fg-subtle">{description}</p>
      </div>
      {children}
    </div>
  )
}

export function DiplomaConfigEditor({ eventId, isActive, token, config, onSaved }: DiplomaConfigEditorProps) {
  const [draft, setDraft] = useState<DiplomaDraft>(() => toDraft(config))
  const [saving, setSaving] = useState<boolean>(false)

  const auth = { Authorization: `Bearer ${token}` }

  // Config vinda do servidor (carga ou salvamento) substitui o rascunho inteiro.
  useEffect(() => {
    setDraft(toDraft(config))
  }, [config])

  // "Não salvo" compara o que seria enviado, então editar e desfazer não deixa o aviso preso.
  const baseline = useMemo(() => JSON.stringify(toPayload(toDraft(config))), [config])
  const dirty = JSON.stringify(toPayload(draft)) !== baseline

  useEffect(() => {
    if (!dirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const setQuestions = (fn: (questions: DraftQuestion[]) => DraftQuestion[]) => setDraft(d => ({ ...d, questions: fn(d.questions) }))

  const updateQuestion = (key: string, patch: Partial<DraftQuestion>) => setQuestions(qs => qs.map(q => (q.key === key ? { ...q, ...patch } : q)))

  // Virar múltipla escolha sem opções já abre 2 campos; as opções ficam guardadas se voltar para nota.
  const changeType = (key: string, type: DiplomaQuestionType) =>
    setQuestions(qs =>
      qs.map(q => (q.key !== key ? q : { ...q, type, options: type === 'multi' && q.options.length === 0 ? [emptyOption(), emptyOption()] : q.options })),
    )

  const addQuestion = (type: DiplomaQuestionType) =>
    setQuestions(qs => [...qs, { key: newKey(), id: '', type, title: '', options: type === 'multi' ? [emptyOption(), emptyOption()] : [] }])

  const setMba = (patch: Partial<DiplomaDraft['mba']>) => setDraft(d => ({ ...d, mba: { ...d.mba, ...patch } }))

  const save = async (): Promise<void> => {
    const error = validateDraft(draft, isActive)
    if (error) {
      ToastifyDisplay({ toastType: 'warning', message: error })()
      return
    }
    setSaving(true)
    try {
      const response = await quizAdminAPI(`/admin/events/${eventId}/diploma-config`, {
        method: 'PUT',
        headers: { ...auth, 'Content-Type': 'application/json' },
        data: JSON.stringify(toPayload(draft)),
      })
      const saved = response.data as DiplomaConfig
      setDraft(toDraft(saved))
      onSaved(saved)
      ToastifyDisplay({ toastType: 'success', message: 'Configuração salva.' })()
    } catch (err) {
      ToastifyDisplay({ toastType: 'error', message: await HandleAxiosAndGenericError(err) })()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="border-line bg-surface sticky top-0 z-10 flex flex-wrap items-center gap-3 rounded-xl border p-3">
        <div className="flex flex-col">
          <span className="text-copy-sm text-fg font-medium">Configuração do diploma</span>
          <span className="text-label-sm text-fg-muted">Perguntas, MBA e palavras-chave são salvos juntos.</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {dirty && (
            <Badge variant="warning" size="sm" dot>
              Não salvo
            </Badge>
          )}
          <Button size="sm" onClick={save} loading={saving} disabled={!dirty}>
            Salvar configuração
          </Button>
        </div>
      </div>

      {isActive && (
        <Alert variant="warning">
          <AlertTitle>Evento ativo</AlertTitle>
          <AlertDescription>Alterações valem para as próximas respostas. O que já foi enviado continua salvo como estava.</AlertDescription>
        </Alert>
      )}

      {/* Perguntas de avaliação */}
      <section className="flex flex-col gap-4">
        <SectionHeader title="Perguntas de avaliação" description={`${draft.questions.length} pergunta(s), na ordem em que o participante vê.`}>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => addQuestion('nps')}>
              <Plus className="size-4" /> Nota 0–10
            </Button>
            <Button size="sm" variant="secondary" onClick={() => addQuestion('multi')}>
              <Plus className="size-4" /> Múltipla escolha
            </Button>
          </div>
        </SectionHeader>

        {draft.questions.length === 0 && <p className="text-copy-sm text-fg-muted py-6 text-center">Nenhuma pergunta de avaliação ainda.</p>}

        {draft.questions.map((question, index) => (
          <Card key={question.key}>
            <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 pb-3">
              <CardTitle className="text-label text-fg-muted font-medium">Pergunta {index + 1}</CardTitle>
              <div className="flex items-center gap-1">
                <select
                  value={question.type}
                  onChange={e => changeType(question.key, e.target.value as DiplomaQuestionType)}
                  className={selectClass}
                  aria-label="Tipo da pergunta"
                >
                  <option value="nps">Nota 0–10</option>
                  <option value="multi">Múltipla escolha</option>
                </select>
                <IconButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  label="Mover pergunta para cima"
                  disabled={index === 0}
                  onClick={() => setQuestions(qs => moveItem(qs, index, -1))}
                >
                  <ArrowUp />
                </IconButton>
                <IconButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  label="Mover pergunta para baixo"
                  disabled={index === draft.questions.length - 1}
                  onClick={() => setQuestions(qs => moveItem(qs, index, 1))}
                >
                  <ArrowDown />
                </IconButton>
                <IconButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  label="Excluir pergunta"
                  onClick={() => setQuestions(qs => qs.filter(q => q.key !== question.key))}
                >
                  <Trash2 />
                </IconButton>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Input
                value={question.title}
                onChange={e => updateQuestion(question.key, { title: e.target.value })}
                placeholder={question.type === 'nps' ? 'Ex.: De 0 a 10, quanto você recomendaria o evento?' : 'Ex.: O que você mais gostou no evento?'}
                maxLength={300}
              />
              {question.type === 'nps' ? (
                <p className="text-copy-sm text-fg-muted">O participante escolhe uma nota de 0 a 10.</p>
              ) : (
                <OptionListEditor options={question.options} onChange={options => updateQuestion(question.key, { options })} />
              )}
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Pergunta do MBA */}
      <section className="flex flex-col gap-4">
        <SectionHeader title="Pergunta do MBA" description="Sim ou Não, e depois os motivos de cada lado." />
        <Card>
          <CardContent className="flex flex-col gap-5 pt-6">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mba-question">Pergunta</Label>
              <Input
                id="mba-question"
                value={draft.mba.question}
                onChange={e => setMba({ question: e.target.value })}
                placeholder="Você pretende entrar no MBA de IA?"
                maxLength={300}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="mba-yes-title">Título dos motivos do Sim</Label>
                <Input
                  id="mba-yes-title"
                  value={draft.mba.yesTitle}
                  onChange={e => setMba({ yesTitle: e.target.value })}
                  placeholder="Ex.: O que mais te atrai no MBA?"
                  maxLength={300}
                />
                <OptionListEditor
                  options={draft.mba.yesOptions}
                  onChange={yesOptions => setMba({ yesOptions })}
                  placeholder="Motivo"
                  addLabel="Adicionar motivo"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="mba-no-title">Título dos motivos do Não</Label>
                <Input
                  id="mba-no-title"
                  value={draft.mba.noTitle}
                  onChange={e => setMba({ noTitle: e.target.value })}
                  placeholder="Ex.: O que te impede hoje?"
                  maxLength={300}
                />
                <OptionListEditor
                  options={draft.mba.noOptions}
                  onChange={noOptions => setMba({ noOptions })}
                  placeholder="Motivo"
                  addLabel="Adicionar motivo"
                />
              </div>
            </div>

            <p className="text-copy-sm text-fg-muted">A opção "Outro" (texto livre) sempre aparece para o participante.</p>
          </CardContent>
        </Card>
      </section>

      {/* Palavras-chave */}
      <section className="flex flex-col gap-4">
        <SectionHeader title="Palavras-chave" description="O participante digita todas, em qualquer ordem, para liberar o diploma." />
        <KeywordsEditor keywords={draft.keywords} onChange={keywords => setDraft(d => ({ ...d, keywords }))} token={token} />
      </section>
    </div>
  )
}
