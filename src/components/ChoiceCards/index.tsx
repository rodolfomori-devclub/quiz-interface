import { Checkbox, Textarea, cn } from '@devclub/ui'

export interface ChoiceOption {
  id: string
  label: string
}

interface ChoiceCardsProps {
  options: ChoiceOption[]
  selected: string[]
  onChange: (ids: string[]) => void
  // Destaca os cards não marcados com borda de erro (ex.: nada escolhido ao tentar avançar).
  invalid?: boolean
  // "Outro": card extra que revela um campo de texto livre.
  allowOther?: boolean
  otherChecked?: boolean
  onOtherCheckedChange?: (checked: boolean) => void
  otherText?: string
  onOtherTextChange?: (text: string) => void
  otherInvalid?: boolean
  otherPlaceholder?: string
}

const OTHER_MAX_LENGTH = 500

const cardClassName = (checked: boolean, invalid: boolean) =>
  cn(
    'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors',
    checked ? 'border-brand bg-brand-subtle' : 'border-line bg-component hover:bg-surface-hover',
    invalid && !checked && 'border-error-line',
  )

// Cards de checkbox (várias opções marcáveis), no visual do SingleChoice da pesquisa do quiz.
export function ChoiceCards({
  options,
  selected,
  onChange,
  invalid = false,
  allowOther = false,
  otherChecked = false,
  onOtherCheckedChange,
  otherText = '',
  onOtherTextChange,
  otherInvalid = false,
  otherPlaceholder,
}: ChoiceCardsProps) {
  const toggle = (id: string, checked: boolean) => {
    const next = new Set(selected)
    if (checked) next.add(id)
    else next.delete(id)
    // Mantém a ordem das opções, não a ordem dos cliques.
    onChange(options.filter(option => next.has(option.id)).map(option => option.id))
  }

  return (
    <div className="grid gap-3">
      {options.map(option => {
        const checked = selected.includes(option.id)
        return (
          <label key={option.id} className={cardClassName(checked, invalid)}>
            <Checkbox checked={checked} onCheckedChange={value => toggle(option.id, value === true)} />
            <span className="text-copy-sm text-fg md:text-copy">{option.label}</span>
          </label>
        )
      })}

      {allowOther && (
        <>
          <label className={cardClassName(otherChecked, invalid)}>
            <Checkbox checked={otherChecked} onCheckedChange={value => onOtherCheckedChange?.(value === true)} />
            <span className="text-copy-sm text-fg md:text-copy">Outro</span>
          </label>

          {otherChecked && (
            <div className="flex flex-col gap-1">
              <Textarea
                value={otherText}
                onChange={e => onOtherTextChange?.(e.target.value)}
                placeholder={otherPlaceholder}
                aria-label="Outro motivo"
                aria-required
                rows={3}
                maxLength={OTHER_MAX_LENGTH}
                invalid={otherInvalid}
                className="resize-none"
              />
              <p className="text-label-sm text-fg-muted text-right">
                {otherText.length}/{OTHER_MAX_LENGTH}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
