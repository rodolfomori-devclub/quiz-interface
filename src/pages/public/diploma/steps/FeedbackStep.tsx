import { FormEvent, useState } from 'react'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from '@devclub/ui'

import { NpsScale } from '../../../../components/NpsScale'
import { ChoiceCards } from '../../../../components/ChoiceCards'
import { ToastifyDisplay } from '../../../../utils'
import type { DiplomaQuestion } from '../../../../types/diploma'

// Rascunho por pergunta: nota (nps) ou ids marcados (multi).
export type DraftAnswers = Record<string, number | string[]>

export function isQuestionAnswered(question: DiplomaQuestion, value: DraftAnswers[string] | undefined): boolean {
  return question.type === 'nps' ? typeof value === 'number' : Array.isArray(value) && value.length > 0
}

const questionElementId = (questionId: string) => `diploma-question-${questionId}`

interface FeedbackStepProps {
  questions: DiplomaQuestion[]
  answers: DraftAnswers
  onChange: (questionId: string, value: number | string[]) => void
  onNext: () => void
}

export function FeedbackStep({ questions, answers, onChange, onNext }: FeedbackStepProps) {
  // Só marca as pendentes depois da primeira tentativa de avançar.
  const [showErrors, setShowErrors] = useState<boolean>(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    const firstMissing = questions.find(question => !isQuestionAnswered(question, answers[question.id]))
    if (firstMissing) {
      setShowErrors(true)
      document.getElementById(questionElementId(firstMissing.id))?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      ToastifyDisplay({ toastType: 'warning', message: 'Responda todas as perguntas para continuar.' })()
      return
    }

    // Nada vai para a API aqui: as respostas seguem junto com o MBA.
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-display">Conta pra gente o que achou do evento 🙏</CardTitle>
          <CardDescription>São perguntas rapidinhas. Depois delas falta pouco para o seu diploma.</CardDescription>
        </CardHeader>
      </Card>

      {questions.map(question => {
        const value = answers[question.id]
        const invalid = showErrors && !isQuestionAnswered(question, value)

        return (
          <Card key={question.id} id={questionElementId(question.id)} className={cn(invalid && 'border-error-line')}>
            <CardHeader>
              <CardTitle className="font-display text-h5">{question.title}</CardTitle>
              <CardDescription>{question.type === 'nps' ? '0 = de jeito nenhum · 10 = com certeza' : 'Marque todas as opções que se aplicam'}</CardDescription>
              {invalid && <p className="text-label-sm text-error-fg">Responda esta pergunta para continuar.</p>}
            </CardHeader>
            <CardContent>
              {question.type === 'nps' ? (
                <NpsScale value={typeof value === 'number' ? value : null} onChange={score => onChange(question.id, score)} />
              ) : (
                <ChoiceCards
                  options={question.options ?? []}
                  selected={Array.isArray(value) ? value : []}
                  onChange={ids => onChange(question.id, ids)}
                  invalid={invalid}
                />
              )}
            </CardContent>
          </Card>
        )
      })}

      <div className="flex w-full md:justify-center">
        <Button type="submit" size="lg" className="w-full md:w-1/2">
          Continuar
        </Button>
      </div>
    </form>
  )
}
