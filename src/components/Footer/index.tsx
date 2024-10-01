import { useLocation } from 'react-router-dom'

export const Footer = () => {
  const currentYear: number = new Date().getFullYear()
  const currentPage: string = useLocation().pathname

  const isPrivatePage: boolean = currentPage === '/quiz'

  return (
    <footer className={`w-full h-fit p-4 relative bottom-0 ${isPrivatePage ? 'bg-white' : 'bg-zinc-100'}`}>
      <div className="w-full flex flex-col gap-2 justify-center">
        <p className="text-zinc-600 text-sm text-center">
          Copyright © {currentYear} Devclub. Todos os direitos reservados
        </p>
        <p className="text-slate-300 text-sm text-center">
          Política de Privacidade
        </p>
      </div>
    </footer>
  )
}
