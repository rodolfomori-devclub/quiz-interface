import { FormEvent, useState } from 'react'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, RadioGroup, RadioGroupItem, cn } from '@devclub/ui'

import { ChoiceCards } from '../../../../components/ChoiceCards'
import { ToastifyDisplay } from '../../../../utils'
import type { DiplomaMba } from '../../../../types/diploma'

// Rascunho da etapa. `other` guarda o texto mesmo com "Outro" desmarcado; só é enviado se marcado.
export interface MbaDraft {
  intent: boolean | null
  reasons: string[]
  otherChecked: boolean
  other: string
}

export const emptyMbaDraft: MbaDraft = { intent: null, reasons: [], otherChecked: false, other: '' }

const intentOptions = [
  { value: 'yes', label: 'Sim' },
  { value: 'no', label: 'Não' },
]

interface MbaStepProps {
  mba: DiplomaMba
  value: MbaDraft
  loading: boolean
  onChange: (next: MbaDraft) => void
  onSubmit: () => void
  onBack?: () => void
}

export function MbaStep({ mba, value, loading, onChange, onSubmit, onBack }: MbaStepProps) {
  const [showErrors, setShowErrors] = useState<boolean>(false)

  const selectedIntent = value.intent === null ? '' : value.intent ? 'yes' : 'no'
  const otherFilled = value.otherChecked && value.other.trim().length > 0
  const intentMissing = value.intent === null
  const otherMissing = value.otherChecked && !otherFilled
  const reasonsMissing = value.reasons.length === 0 && !otherFilled

  const handleIntent = (next: string) => {
    const intent = next === 'yes'
    if (intent === value.intent) return
    // Sim e Não têm listas de motivos diferentes: nada do lado anterior continua valendo.
    onChange({ intent, reasons: [], otherChecked: false, other: '' })
    setShowErrors(false)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    const message = intentMissing
      ? 'Responda se você pretende entrar no MBA.'
      : otherMissing
        ? 'Conte qual é o outro motivo ou desmarque "Outro".'
        : reasonsMissing
          ? 'Escolha pelo menos um motivo.'
          : null

    if (message) {
      setShowErrors(true)
      ToastifyDisplay({ toastType: 'warning', message })()
      return
    }

    onSubmit()
  }

  const reasonsTitle = value.intent ? mba.yesTitle : mba.noTitle
  const reasonOptions = value.intent ? mba.yesOptions : mba.noOptions

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <Card className={cn(showErrors && intentMissing && 'border-error-line')}>
        <CardHeader>
          <CardTitle className="font-display text-h5">{mba.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup name="mbaIntent" value={selectedIntent} onValueChange={handleIntent} aria-label={mba.question}>
            {intentOptions.map(option => (
              <label
                key={option.value}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors',
                  selectedIntent === option.value ? 'border-brand bg-brand-subtle' : 'border-line bg-component hover:bg-surface-hover',
                )}
              >
                <RadioGroupItem value={option.value} />
                <span className="text-copy-sm text-fg md:text-copy">{option.label}</span>
              </label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {value.intent !== null && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-h5">
              {reasonsTitle || (value.intent ? 'Por que você pretende entrar?' : 'Por que você não pretende entrar?')}
            </CardTitle>
            <CardDescription>Marque todas as opções que se aplicam</CardDescription>
          </CardHeader>
          <CardContent>
            <ChoiceCards
              options={reasonOptions}
              selected={value.reasons}
              onChange={reasons => onChange({ ...value, reasons })}
              invalid={showErrors && reasonsMissing}
              allowOther
              otherChecked={value.otherChecked}
              onOtherCheckedChange={otherChecked => onChange({ ...value, otherChecked })}
              otherText={value.other}
              onOtherTextChange={other => onChange({ ...value, other })}
              otherInvalid={showErrors && otherMissing}
              otherPlaceholder="Conta pra gente o seu motivo"
            />
          </CardContent>
        </Card>
      )}

      <div className="flex w-full flex-col-reverse gap-3 md:flex-row md:justify-center">
        {onBack && (
          <Button type="button" variant="outline" size="lg" onClick={onBack} disabled={loading} className="w-full md:w-auto">
            Voltar
          </Button>
        )}
        <Button type="submit" size="lg" loading={loading} className="w-full md:w-1/2">
          Continuar
        </Button>
      </div>
    </form>
  )
}
