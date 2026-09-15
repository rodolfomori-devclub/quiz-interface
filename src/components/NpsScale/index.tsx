import { cn } from '@devclub/ui'

interface NpsScaleProps {
  value: number | null
  onChange: (score: number) => void
}

// Grade de nota 0–10 com o mesmo visual da pesquisa do quiz (pages/private/feedback).
export function NpsScale({ value, onChange }: NpsScaleProps) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-11">
      {Array.from({ length: 11 }, (_, i) => i).map(score => (
        <button
          key={score}
          type="button"
          aria-pressed={value === score}
          onClick={() => onChange(score)}
          className={cn(
            'h-10 rounded-md border font-mono text-sm font-bold transition-colors',
            'focus-visible:outline-focus outline-none focus-visible:outline-2 focus-visible:outline-offset-2',
            value === score ? 'border-brand bg-brand text-on-brand' : 'border-line bg-component text-fg-subtle hover:bg-surface-hover',
          )}
        >
          {score}
        </button>
      ))}
    </div>
  )
}
