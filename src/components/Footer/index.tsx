export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full h-fit p-4 bg-zinc-100 relative bottom-0">
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
