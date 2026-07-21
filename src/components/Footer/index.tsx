import { useLocation } from 'react-router-dom'

export const Footer = () => {
  const currentYear: number = new Date().getFullYear()
  const currentPage: string = useLocation().pathname

  const isPolicyPage: boolean = currentPage === '/politica-de-privacidade'

  return (
    <footer className="mt-8 w-full border-t border-line">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-1 px-4 py-6">
        <p className="text-center text-label-sm text-fg-muted">
          Copyright © {currentYear} <span className="font-pixel uppercase tracking-caps text-fg-subtle">Devclub</span>. Todos os direitos reservados
        </p>
        {!isPolicyPage && (
          <a
            href="/politica-de-privacidade"
            rel="noopener noreferrer"
            target="_blank"
            className="text-label-sm text-fg-muted transition-colors hover:text-fg-brand"
          >
            Política de Privacidade
          </a>
        )}
      </div>
    </footer>
  )
}
