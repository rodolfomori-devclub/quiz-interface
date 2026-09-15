import { useMemo, useRef, useState } from 'react'
import { Award, ExternalLink, FileSpreadsheet, KeyRound, MessageSquareText, Users } from 'lucide-react'

import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Spinner,
  StatCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from '@devclub/ui'

import { quizAdminAPI } from '../../../../services/api'
import { DiplomaAttempt, DiplomaConfig, DiplomaSubmission } from '../../../../types/diploma'
import { HandleAxiosAndGenericError, ToastifyDisplay } from '../../../../utils'
import { exportDiplomaXLSX, formatDateTime, formatPhone, whatsappLink } from '../../../../utils/diploma'

interface DiplomaSubmissionsProps {
  submissions: DiplomaSubmission[]
  config: DiplomaConfig | null
  eventName: string
  loading: boolean
  token?: string
  onDeleted: () => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-label-xs tracking-caps text-fg-muted font-semibold uppercase">{title}</span>
      {children}
    </div>
  )
}

function MbaBadge({ intent }: { intent: boolean | null }) {
  if (intent === null || intent === undefined) return <span className="text-fg-muted">—</span>
  return intent ? (
    <Badge variant="success" size="sm">
      Sim
    </Badge>
  ) : (
    <Badge variant="neutral" size="sm">
      Não
    </Badge>
  )
}

export function DiplomaSubmissions({ submissions, config, eventName, loading, token, onDeleted }: DiplomaSubmissionsProps) {
  const [search, setSearch] = useState<string>('')
  const [selected, setSelected] = useState<DiplomaSubmission | null>(null)
  const [attempts, setAttempts] = useState<DiplomaAttempt[] | null>(null)
  const [loadingAttempts, setLoadingAttempts] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<boolean>(false)
  // Evita que a resposta de um envio aberto antes sobrescreva as tentativas do atual.
  const openedId = useRef<string | null>(null)

  const auth = { Authorization: `Bearer ${token}` }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return submissions
    return submissions.filter(s => s.name.toLowerCase().includes(term) || s.email.toLowerCase().includes(term))
  }, [search, submissions])

  const stats = useMemo(() => {
    const tried = submissions.filter(s => s.attemptsCount > 0)
    const avg = tried.length > 0 ? tried.reduce((total, s) => total + s.attemptsCount, 0) / tried.length : null
    return {
      answered: submissions.filter(s => s.answersSubmittedAt).length,
      passed: submissions.filter(s => s.passedAt).length,
      avgAttempts: avg !== null ? avg.toFixed(1) : '—',
    }
  }, [submissions])

  // As tentativas só são buscadas quando os detalhes abrem.
  const openDetails = async (sub: DiplomaSubmission): Promise<void> => {
    openedId.current = sub.id
    setSelected(sub)
    setAttempts(null)
    setLoadingAttempts(true)
    try {
      const response = await quizAdminAPI(`/admin/diploma-submissions/${sub.id}/attempts`, { method: 'GET', headers: auth })
      if (openedId.current === sub.id) setAttempts(response.data as DiplomaAttempt[])
    } catch (error) {
      if (openedId.current === sub.id) ToastifyDisplay({ toastType: 'error', message: await HandleAxiosAndGenericError(error) })()
    } finally {
      if (openedId.current === sub.id) setLoadingAttempts(false)
    }
  }

  const closeDetails = () => {
    openedId.current = null
    setSelected(null)
  }

  const handleDelete = async (): Promise<void> => {
    if (!selected) return
    if (!window.confirm(`Excluir o envio de ${selected.name}? As respostas e tentativas somem e não dá para desfazer.`)) return
    setDeleting(true)
    try {
      await quizAdminAPI(`/admin/diploma-submissions/${selected.id}`, { method: 'DELETE', headers: auth })
      ToastifyDisplay({ toastType: 'success', message: 'Envio excluído.' })()
      closeDetails()
      onDeleted()
    } catch (error) {
      ToastifyDisplay({ toastType: 'error', message: await HandleAxiosAndGenericError(error) })()
    } finally {
      setDeleting(false)
    }
  }

  const handleExport = () => {
    if (!config) return
    exportDiplomaXLSX(filtered, config, eventName)
    ToastifyDisplay({ toastType: 'success', message: 'Exportação realizada com sucesso.' })()
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Leads" value={submissions.length} icon={<Users />} />
        <StatCard label="Responderam" value={stats.answered} icon={<MessageSquareText />} />
        <StatCard label="Diplomas liberados" value={stats.passed} icon={<Award />} variant="glow" />
        <StatCard label="Média de tentativas" value={stats.avgAttempts} icon={<KeyRound />} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Input
          type="text"
          inputSize="sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Pesquisar por nome ou e-mail..."
          className="w-full sm:w-80"
          maxLength={128}
        />
        {loading && <Spinner className="text-fg-muted size-5" />}
        <Button variant="outline" size="sm" className="ml-auto" onClick={handleExport} disabled={!config || filtered.length === 0}>
          <FileSpreadsheet className="size-4" /> Exportar XLSX
        </Button>
      </div>

      <div className="border-line bg-surface mt-4 rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>MBA</TableHead>
              <TableHead>Diploma</TableHead>
              <TableHead>Tentativas</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-fg-muted py-8 text-center">
                  {loading ? 'Carregando envios...' : submissions.length === 0 ? 'Nenhum envio ainda.' : 'Nenhum envio encontrado para essa busca.'}
                </TableCell>
              </TableRow>
            )}
            {filtered.map((sub, index) => (
              <TableRow key={sub.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="max-w-[220px] truncate">{sub.name}</TableCell>
                <TableCell className="max-w-[220px] truncate">{sub.email}</TableCell>
                <TableCell className="font-mono whitespace-nowrap">
                  <a href={whatsappLink(sub.phone, sub.doLiveAbroad)} target="_blank" rel="noreferrer" className="text-fg-brand hover:underline">
                    {formatPhone(sub.phone, sub.doLiveAbroad)}
                  </a>
                </TableCell>
                <TableCell>
                  <MbaBadge intent={sub.mbaIntent} />
                </TableCell>
                <TableCell>
                  {sub.passedAt ? (
                    <Badge variant="success" size="sm">
                      Liberado
                    </Badge>
                  ) : (
                    <Badge variant="warning" size="sm">
                      Pendente
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center font-mono">{sub.attemptsCount}</TableCell>
                <TableCell className="whitespace-nowrap">{formatDateTime(sub.createdAt)}</TableCell>
                <TableCell className="text-center">
                  <span className="text-fg-brand cursor-pointer transition-opacity hover:opacity-80" onClick={() => openDetails(sub)}>
                    Ver
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={open => {
          if (!open) closeDetails()
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="text-copy-sm flex flex-col gap-5">
              <Section title="Contato">
                <div className="text-fg-subtle flex flex-col gap-1">
                  <span>{selected.email}</span>
                  <a
                    href={whatsappLink(selected.phone, selected.doLiveAbroad)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-fg-brand font-mono hover:underline"
                  >
                    {formatPhone(selected.phone, selected.doLiveAbroad)}
                    {selected.doLiveAbroad ? ' (estrangeiro)' : ''}
                  </a>
                  <span className="text-label-sm text-fg-muted">Cadastro em {formatDateTime(selected.createdAt)}</span>
                </div>
              </Section>

              <Section title="Avaliação">
                {selected.answers && selected.answers.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {selected.answers.map(answer => (
                      <li key={answer.questionId} className="flex flex-col">
                        <span className="text-fg">{answer.title}</span>
                        <span className="text-fg-subtle">{answer.type === 'nps' ? `Nota ${answer.score}` : answer.labels.join(', ')}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-fg-muted">Ainda não respondeu a avaliação.</p>
                )}
              </Section>

              <Section title="MBA">
                {typeof selected.mbaIntent === 'boolean' ? (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-fg flex items-center gap-2">
                      Pretende entrar: <MbaBadge intent={selected.mbaIntent} />
                    </span>
                    {(selected.mbaReasons ?? []).length > 0 && (
                      <ul className="text-fg-subtle list-inside list-disc">
                        {(selected.mbaReasons ?? []).map(reason => (
                          <li key={reason.id}>{reason.label}</li>
                        ))}
                      </ul>
                    )}
                    {selected.mbaOther && <p className="border-line bg-component text-fg rounded-lg border p-3">Outro: “{selected.mbaOther}”</p>}
                  </div>
                ) : (
                  <p className="text-fg-muted">Ainda não respondeu.</p>
                )}
              </Section>

              <Section title={`Tentativas de palavras-chave (${selected.attemptsCount})`}>
                {loadingAttempts ? (
                  <Spinner className="text-fg-muted size-5" />
                ) : attempts && attempts.length > 0 ? (
                  <ul className="flex flex-col gap-1.5">
                    {attempts.map(attempt => (
                      <li key={attempt.id} className="border-line bg-component flex items-start gap-2 rounded-md border px-3 py-2">
                        <span className={cn('font-mono', attempt.passed ? 'text-success-fg' : 'text-error-fg')} title={attempt.passed ? 'Acertou' : 'Errou'}>
                          {attempt.passed ? '✓' : '✗'}
                        </span>
                        <span className="text-label-sm text-fg min-w-0 flex-1 font-mono break-words">{attempt.inputs.map(v => `“${v}”`).join(' · ')}</span>
                        <span className="text-label-xs text-fg-muted shrink-0">{formatDateTime(attempt.createdAt, true)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-fg-muted">Nenhuma tentativa.</p>
                )}
              </Section>

              <Section title="Diploma">
                {selected.passedAt && selected.certificateUrl ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <Button asChild variant="outline" size="sm">
                      <a href={selected.certificateUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="size-4" /> Abrir diploma
                      </a>
                    </Button>
                    <span className="text-label-sm text-fg-muted">Liberado em {formatDateTime(selected.passedAt)}</span>
                  </div>
                ) : (
                  <p className="text-fg-muted">Ainda não liberado.</p>
                )}
              </Section>
            </div>
          )}

          <DialogFooter className="mt-2">
            <Button type="button" variant="destructive" size="sm" onClick={handleDelete} loading={deleting}>
              Excluir envio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
