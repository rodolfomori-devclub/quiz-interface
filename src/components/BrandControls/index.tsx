import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

import { getTheme, toggleTheme, type Theme } from '../../theme'

/** Botão de tema sol/lua. Rótulo/ícone só depois do mount (SSR-safe e evita mismatch). */
function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    setThemeState(getTheme())
    setMounted(true)
  }, [])

  const handleToggle = () => {
    toggleTheme()
    setThemeState(getTheme())
  }

  return (
    <button
      type="button"
      aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
      onClick={handleToggle}
      className="inline-flex size-10 items-center justify-center rounded-md border border-line bg-surface text-fg-subtle transition-colors hover:text-fg-brand"
    >
      {mounted && theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  )
}

/** Controles de marca: alternância de tema. O fundo animado fica sempre ligado. */
export function BrandControls() {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
    </div>
  )
}
