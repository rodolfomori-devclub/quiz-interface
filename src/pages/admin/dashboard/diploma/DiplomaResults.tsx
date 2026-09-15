import { useMemo } from 'react'
import { GraduationCap, MessageSquareText, Users2 } from 'lucide-react'

import { Badge, Card, CardContent, CardHeader, CardTitle, StatCard } from '@devclub/ui'

import { DiplomaConfig, DiplomaSubmission } from '../../../../types/diploma'
import { NpsResult, aggregateDiploma } from '../../../../utils/diploma'
import { Bar, QuestionBlock } from '../FeedbackResults'

interface DiplomaResultsProps {
  submissions: DiplomaSubmission[]
  config: DiplomaConfig
}

const pct = (count: number, total: number) => (total > 0 ? Math.round((count / total) * 100) : 0)

function NpsBlock({ result }: { result: NpsResult }) {
  const avgText = result.avg !== null ? result.avg.toFixed(1) : '—'
  const scoreText = result.score !== null ? (result.score > 0 ? `+${result.score}` : String(result.score)) : '—'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-h5">{result.title}</CardTitle>
        <span className="text-label-sm text-fg-muted font-mono">
          {result.answered} resposta(s) · média {avgText} · NPS {scoreText}
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Bar label="Promotores (9-10)" count={result.promoters} total={result.answered} />
        <Bar label="Neutros (7-8)" count={result.passives} total={result.answered} />
        <Bar label="Detratores (0-6)" count={result.detractors} total={result.answered} />
      </CardContent>
    </Card>
  )
}

export function DiplomaResults({ submissions, config }: DiplomaResultsProps) {
  const agg = useMemo(() => aggregateDiploma(submissions, config), [submissions, config])
  const { mba } = agg

  if (agg.respondents === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
          <MessageSquareText className="text-fg-muted size-8" />
          <p className="font-display text-h5 text-fg">Nenhuma resposta ainda</p>
          <p className="text-copy-sm text-fg-subtle">As respostas da avaliação e da pergunta do MBA aparecerão aqui.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mt-4 flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard label="Responderam" value={agg.respondents} icon={<Users2 />} />
        <StatCard label="Pretendem entrar no MBA" value={`${pct(mba.yes, mba.answered)}%`} icon={<GraduationCap />} variant="glow" />
        <StatCard label="Não pretendem" value={`${pct(mba.no, mba.answered)}%`} icon={<GraduationCap />} />
      </div>

      {agg.questions.some(q => q.type === 'multi') && (
        <p className="text-copy-sm text-fg-muted">
          Em múltipla escolha cada pessoa pode marcar várias opções: a % é sobre quem respondeu a pergunta, então a soma pode passar de 100%.
        </p>
      )}

      {agg.questions.map(result =>
        result.type === 'nps' ? (
          <NpsBlock key={result.questionId} result={result} />
        ) : (
          <QuestionBlock key={result.questionId} title={result.title} rows={result.rows} total={result.answered} />
        ),
      )}

      <QuestionBlock
        title={config.mba.question || 'Pretende entrar no MBA?'}
        rows={[
          { label: 'Sim', count: mba.yes },
          { label: 'Não', count: mba.no },
        ]}
        total={mba.answered}
      />
      <QuestionBlock title={`Sim · ${config.mba.yesTitle || 'Motivos'}`} rows={mba.yesRows} total={mba.yes} />
      <QuestionBlock title={`Não · ${config.mba.noTitle || 'Motivos'}`} rows={mba.noRows} total={mba.no} />

      {/* Textos livres do "Outro" */}
      <Card className="border-brand-line">
        <CardHeader>
          <CardTitle className="font-display text-h5 flex items-center gap-2">
            <MessageSquareText className="text-fg-brand size-5" />
            Respostas em "Outro"
          </CardTitle>
          <span className="text-label-sm text-fg-muted font-mono">{mba.others.length} resposta(s) aberta(s)</span>
        </CardHeader>
        <CardContent>
          {mba.others.length === 0 ? (
            <p className="text-copy-sm text-fg-muted">Ninguém escreveu um motivo próprio até agora.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {mba.others.map((item, i) => (
                <li key={i} className="border-line bg-component rounded-lg border p-3">
                  <p className="text-copy-sm text-fg">“{item.text}”</p>
                  <p className="text-label-xs tracking-caps text-fg-muted mt-1.5 flex items-center gap-2 uppercase">
                    — {item.name}
                    <Badge variant={item.intent ? 'success' : 'neutral'} size="sm">
                      {item.intent ? 'Sim' : 'Não'}
                    </Badge>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
