export const PrivateHeader = () => {
  return (
    <header className="w-full h-[150px] border-t-4 border-blue-500 mx-auto flex flex-col justify-center gap-4">
      <div className="w-full">
        <h2 className="text-xl font-semibold text-blue-500 text-center uppercase">Desafio da</h2>
        <h1 className="font-semibold uppercase tracking-[0.2rem] text-2xl text-center"><b className="text-slate-900">Gestão de Tráfego</b></h1>
      </div>

      <div className="w-full flex items-center justify-between px-6">
        <span className="flex flex-col gap-0.5">
          <p className="text-zinc-600 text-sm">Olá, <b>Marcus Vinícius B Santos</b></p><i className="text-sm">begheli2020@gmail.com</i>
        </span>

        <span>
          <button type="button" className="uppercase text-zinc-600 text-sm">Sair</button>
        </span>
      </div>
    </header>
  )
}