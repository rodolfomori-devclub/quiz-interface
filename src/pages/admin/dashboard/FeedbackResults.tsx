import { useMemo, useState } from 'react'
import { MessageSquareText, Star, TrendingUp, Users2, UserRound } from 'lucide-react'

import { Button, Card, CardContent, CardHeader, CardTitle, StatCard, Badge } from '@devclub/ui'

import { User } from '../../../hooks/user'
import {
  attendanceLabels,
  consumptionFormatLabels,
  highlightLabels,
  transformationLabels,
  devclubStatusLabels,
  obstacleLabels,
} from '../../../utils/eventFeedback'

interface FeedbackResultsProps {
  users: User[]
  onOpenIndividual: (user: User) => void
}

type LabelMap = Record<string, string>

interface BarRow {
  label: string
  count: number
}

/** Barra horizontal de distribuição (rótulo + contagem + %). */
function Bar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-3 text-copy-sm">
        <span className="text-fg-subtle">{label}</span>
        <span className="shrink-0 font-mono text-label-sm text-fg-muted">
          {count} · {pct}%
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-component">
        <div className="h-full rounded-full bg-brand transition-[width]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

/** Bloco de uma pergunta agregada. */
function QuestionBlock({ title, rows, total }: { title: string; rows: BarRow[]; total: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-h5">{title}</CardTitle>
        <span className="font-mono text-label-sm text-fg-muted">{total} resposta(s)</span>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {rows.map(row => (
          <Bar key={row.label} label={row.label} count={row.count} total={total} />
        ))}
      </CardContent>
    </Card>
  )
}

function distribution(users: User[], field: keyof NonNullable<User['eventFeedback']>, map: LabelMap) {
  const counts: Record<string, number> = {}
  Object.keys(map).forEach(k => (counts[k] = 0))
  let answered = 0
  users.forEach(u => {
    const value = u.eventFeedback?.[field] as string | null | undefined
    if (value && value in counts) {
      counts[value] += 1
      answered += 1
    }
  })
  const rows: BarRow[] = Object.entries(map).map(([value, label]) => ({ label, count: counts[value] }))
  return { rows, answered }
}

export function FeedbackResults({ users, onOpenIndividual }: FeedbackResultsProps) {
  const withFeedback = useMemo(() => users.filter(u => u.eventFeedback), [users])
  const total = withFeedback.length

  const nps = useMemo(() => {
    const values = withFeedback
      .map(u => u.eventFeedback?.npsScore)
      .filter((v): v is number => typeof v === 'number')
    if (values.length === 0) return { avg: null as number | null, score: null as number | null, promoters: 0, passives: 0, detractors: 0, answered: 0 }
    const promoters = values.filter(v => v >= 9).length
    const passives = values.filter(v => v >= 7 && v <= 8).length
    const detractors = values.filter(v => v <= 6).length
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const score = Math.round(((promoters - detractors) / values.length) * 100)
    return { avg, score, promoters, passives, detractors, answered: values.length }
  }, [withFeedback])

  const willJoin = useMemo(
    () => withFeedback.filter(u => ['student', 'joining'].includes(u.eventFeedback?.devclubStatus ?? '')).length,
    [withFeedback]
  )

  const improvements = useMemo(
    () =>
      withFeedback
        .filter(u => (u.eventFeedback?.improvement ?? '').trim() !== '')
        .map(u => ({ name: u.name ?? 'Anônimo', text: (u.eventFeedback?.improvement ?? '').trim() })),
    [withFeedback]
  )

  const [view, setView] = useState<'resumo' | 'individuais'>('resumo')

  if (total === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
          <MessageSquareText className="size-8 text-fg-muted" />
          <p className="font-display text-h5 text-fg">Nenhuma resposta ainda</p>
          <p className="text-copy-sm text-fg-subtle">As respostas do feedback pré-quiz aparecerão aqui.</p>
        </CardContent>
      </Card>
    )
  }

  const npsAvgText = nps.avg !== null ? nps.avg.toFixed(1) : '—'
  const npsScoreText = nps.score !== null ? (nps.score > 0 ? `+${nps.score}` : String(nps.score)) : '—'

  return (
    <div className="mt-4 flex flex-col gap-5">
      {/* Alternância Resumo / Individuais */}
      <div className="flex items-center gap-2">
        <Button variant={view === 'resumo' ? 'primary' : 'outline'} size="sm" onClick={() => setView('resumo')}>
          Resumo geral
        </Button>
        <Button variant={view === 'individuais' ? 'primary' : 'outline'} size="sm" onClick={() => setView('individuais')}>
          Respostas individuais
        </Button>
      </div>

      {view === 'resumo' ? (
        <>
          {/* Cards de topo */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Respostas" value={total} icon={<Users2 />} />
            <StatCard label="NPS médio (0-10)" value={npsAvgText} icon={<Star />} variant="glow" />
            <StatCard label="NPS score" value={npsScoreText} icon={<TrendingUp />} />
            <StatCard label="Vão / já no DevClub" value={willJoin} icon={<UserRound />} />
          </div>

          {/* NPS agrupado */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-h5">Recomendação (NPS)</CardTitle>
              <span className="font-mono text-label-sm text-fg-muted">{nps.answered} resposta(s)</span>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Bar label="Promotores (9-10)" count={nps.promoters} total={nps.answered} />
              <Bar label="Neutros (7-8)" count={nps.passives} total={nps.answered} />
              <Bar label="Detratores (0-6)" count={nps.detractors} total={nps.answered} />
            </CardContent>
          </Card>

          {/* Perguntas de escolha única */}
          {(() => {
            const a = distribution(withFeedback, 'attendance', attendanceLabels)
            return <QuestionBlock title="Quantas aulas assistiu?" rows={a.rows} total={a.answered} />
          })()}
          {(() => {
            const a = distribution(withFeedback, 'consumptionFormat', consumptionFormatLabels)
            return <QuestionBlock title="Como acompanhou as aulas?" rows={a.rows} total={a.answered} />
          })()}
          {(() => {
            const a = distribution(withFeedback, 'highlight', highlightLabels)
            return <QuestionBlock title="O que mais marcou no evento?" rows={a.rows} total={a.answered} />
          })()}
          {(() => {
            const a = distribution(withFeedback, 'transformation', transformationLabels)
            return <QuestionBlock title="Sentimento depois do evento" rows={a.rows} total={a.answered} />
          })()}
          {(() => {
            const a = distribution(withFeedback, 'devclubStatus', devclubStatusLabels)
            return <QuestionBlock title="Status DevClub" rows={a.rows} total={a.answered} />
          })()}
          {(() => {
            const a = distribution(withFeedback, 'obstacle', obstacleLabels)
            return <QuestionBlock title="Maior obstáculo (quem ainda não decidiu)" rows={a.rows} total={a.answered} />
          })()}

          {/* Campo aberto — destaque */}
          <Card className="border-brand-line">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-h5">
                <MessageSquareText className="size-5 text-fg-brand" />
                Sugestões de melhoria
              </CardTitle>
              <span className="font-mono text-label-sm text-fg-muted">{improvements.length} resposta(s) aberta(s)</span>
            </CardHeader>
            <CardContent>
              {improvements.length === 0 ? (
                <p className="text-copy-sm text-fg-muted">Nenhuma sugestão escrita até agora.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {improvements.map((item, i) => (
                    <li key={i} className="rounded-lg border border-line bg-component p-3">
                      <p className="text-copy-sm text-fg">“{item.text}”</p>
                      <p className="mt-1.5 text-label-xs uppercase tracking-caps text-fg-muted">— {item.name}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        /* Respostas individuais */
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-h5">Respostas individuais</CardTitle>
            <span className="font-mono text-label-sm text-fg-muted">{total} respondente(s)</span>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col divide-y divide-line">
              {withFeedback.map(user => {
                const hasText = (user.eventFeedback?.improvement ?? '').trim() !== ''
                return (
                  <li key={user.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-copy-sm font-medium text-fg">{user.name}</span>
                      <span className="flex items-center gap-2 text-label-sm text-fg-muted">
                        <span className="font-mono">NPS {user.eventFeedback?.npsScore ?? '—'}</span>
                        {hasText && (
                          <Badge variant="brand" size="sm">
                            comentou
                          </Badge>
                        )}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => onOpenIndividual(user)}>
                      Ver tudo
                    </Button>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
