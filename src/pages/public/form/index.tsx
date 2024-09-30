import { Header } from "../../../components/Header"
import { Footer } from "../../../components/Footer"

import mainBannerImg from "../../../assets/banner-min.png"

import { useNavigate } from "react-router-dom"

export function Form() {
  const navigate = useNavigate()

  const handleNavigate = (): void => {
    navigate('/quiz')
  }
  
  return (
    <div className="w-full h-screen">
      <Header />

      <img src={mainBannerImg} alt="Banner oficial do evento" className="w-full object-cover mt-2" />

      <form className="w-full mt-4">
        <h4 className="text-sm text-blue-500 font-bold text-center">Preencha seus dados para continuar</h4>

        <div className="p-5 flex flex-col gap-3 justify-center">
          <div className="flex items-center gap-1 w-full justify-center">
            <input type="checkbox" />
            <p className="text-zinc-600 text-sm">Sou estrangeiro</p>
          </div>

          <input id="user-name" type="text" className="h-12 text-sm rounded-sm bg-zinc-100 pl-3 font-semibold" placeholder="Seu nome completo" />

          <input id="user-email" type="text" className="h-12 text-sm rounded-sm bg-zinc-100 pl-3 font-semibold" placeholder="Seu e-mail" />

          <input id="user-phone" type="text" className="h-12 text-sm rounded-sm bg-zinc-100 pl-3 font-semibold" placeholder="Seu Telefone" />

          <input id="user-cpf" type="text" className="h-12 text-sm rounded-sm bg-zinc-100 pl-3 font-semibold" placeholder="Seu CPF" />

          <input id="user-birthdate" type="text" className="h-12 text-sm rounded-sm bg-zinc-100 pl-3 font-semibold" placeholder="Sua data de aniversário" />

            {/* mudar p/ type submit depois */}
          <button onClick={handleNavigate} type="button" className="text-white bg-blue-500 h-14 rounded-sm shadow-sm w-full mt-4 font-bold uppercase" >Acessar o Quiz</button>
        </div>
      </form>

      <Footer />
    </div>
  )
}