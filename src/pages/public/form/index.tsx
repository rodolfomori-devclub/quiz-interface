import { useState } from 'react'
import { Header } from "../../../components/Header"
import { Footer } from "../../../components/Footer"

import mainBannerImg from "../../../assets/banner-min.png"

import { useNavigate } from "react-router-dom"

import { CiUser } from "react-icons/ci"
import { MdOutlineEmail } from "react-icons/md"
import { CiPhone } from "react-icons/ci"
import { PiIdentificationCard } from "react-icons/pi"
import { MdOutlineDateRange } from "react-icons/md"

export function Form() {
  const [isForeigner, setIsForeigner] = useState(false)
  
  const navigate = useNavigate()

  const handleNavigate = (): void => {
    navigate('/quiz')
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsForeigner(e.target.checked)
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />

      <img src={mainBannerImg} alt="Banner oficial do evento" className="w-full object-cover mt-2" />

      <form className="w-full mt-4 flex-grow">
        <h4 className="text-sm text-blue-500 font-bold text-center">Preencha seus dados para continuar</h4>

        <div className="p-5 flex flex-col gap-3 justify-center">
          <div className="flex items-center gap-1 w-full justify-center">
            <input
              type="checkbox"
              checked={isForeigner}
              onChange={handleCheckboxChange}
            />
            <p className="text-zinc-600 text-sm">Sou estrangeiro</p>
          </div>

          <div className="flex items-center bg-zinc-100 rounded-sm">
            <CiUser className="text-zinc-500 ml-3" size={24} />
            <input
              id="user-name"
              type="text"
              className="h-12 w-full text-sm rounded-sm bg-transparent pl-3 font-semibold"
              placeholder="Seu nome completo"
            />
          </div>

          <div className="flex items-center bg-zinc-100 rounded-sm">
            <MdOutlineEmail className="text-zinc-500 ml-3" size={24} />
            <input
              id="user-email"
              type="text"
              className="h-12 w-full text-sm rounded-sm bg-transparent pl-3 font-semibold"
              placeholder="Seu e-mail"
            />
          </div>

          <div className="flex items-center bg-zinc-100 rounded-sm">
            <CiPhone className="text-zinc-500 ml-3" size={24} />
            <input
              id="user-phone"
              type="text"
              className="h-12 w-full text-sm rounded-sm bg-transparent pl-3 font-semibold"
              placeholder={isForeigner ? "Seu Telefone + código do país" : "Seu Telefone"}
            />
          </div>

          <div className="flex items-center bg-zinc-100 rounded-sm">
            <PiIdentificationCard className="text-zinc-500 ml-3" size={24} />
            <input
              id="user-cpf"
              type="text"
              className="h-12 w-full text-sm rounded-sm bg-transparent pl-3 font-semibold"
              placeholder={isForeigner ? "Seu documento estrangeiro" : "Seu CPF"}
            />
          </div>

          <div className="flex items-center bg-zinc-100 rounded-sm">
            <MdOutlineDateRange className="text-zinc-500 ml-3" size={24} />
            <input
              id="user-birthdate"
              type="text"
              className="h-12 w-full text-sm rounded-sm bg-transparent pl-3 font-semibold"
              placeholder="Sua data de aniversário"
            />
          </div>

          <button
            onClick={handleNavigate}
            type="button"
            className="text-white bg-blue-500 h-14 rounded-sm shadow-sm w-full mt-4 font-bold uppercase"
          >
            Acessar o Quiz
          </button>
        </div>
      </form>

      <Footer />
    </div>
  )
}
