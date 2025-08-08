import { useLocation } from 'react-router-dom'

export const Footer = () => {
  const currentYear: number = new Date().getFullYear()
  const currentPage: string = useLocation().pathname

  const isPrivatePage: boolean = currentPage === '/quiz'
  const isPolicyPage: boolean = currentPage === '/politica-de-privacidade'

  return (
    <footer className={`w-full h-fit p-4 relative bottom-0 ${isPrivatePage ? 'bg-background-light' : 'bg-neutral-100'}`}>
      <div className="w-full flex flex-col gap-2 justify-center">
        <p className="text-neutral-600 text-sm text-center">
          Copyright © {currentYear} Devclub. Todos os direitos reservados
        </p>
        {!isPolicyPage && (
          <a href="/politica-de-privacidade" rel="noopener noreferrer" className="text-neutral-400 text-sm text-center hover:opacity-80" target="_blank">
            Política de Privacidade
          </a>
        )}
      </div>
    </footer>
  )
}
