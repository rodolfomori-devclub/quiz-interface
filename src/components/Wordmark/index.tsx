interface WordmarkProps {
  size?: 'sm' | 'md'
  align?: 'left' | 'center'
}

/** Wordmark da marca: eyebrow "DESAFIO DO" em pixel + "QUIZ" em display com cursor verde. */
export function Wordmark({ size = 'md', align = 'left' }: WordmarkProps) {
  return (
    <div className={`flex flex-col leading-none ${align === 'center' ? 'items-center text-center' : 'items-start'}`}>
      <span className="font-pixel text-[0.6rem] uppercase tracking-caps text-fg-muted">Desafio do</span>
      <span className={`font-display font-extrabold tracking-tight text-fg ${size === 'sm' ? 'text-2xl' : 'text-3xl'}`}>
        QUIZ<span className="ml-0.5 font-mono font-normal text-fg-brand">_</span>
      </span>
    </div>
  )
}
