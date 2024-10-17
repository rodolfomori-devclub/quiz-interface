import { FormEventHandler, useEffect, useState } from "react"
import { Header } from "../../../components/Header"
import { Footer } from "../../../components/Footer"

import mainBannerImg from "../../../assets/banner-min.png"

import { useNavigate, useLocation } from "react-router-dom"

import { LuPhone } from "react-icons/lu"
import { RiUser3Line } from "react-icons/ri"
import { MdOutlineEmail } from "react-icons/md"
import { MdOutlineDateRange } from "react-icons/md"
import { PiIdentificationCard } from "react-icons/pi"

import { useUser } from '../../../hooks/user'
import { quizUserAPI } from '../../../services/api'
import { HandleAxiosAndGenericError, ToastifyDisplay } from '../../../utils'

import InputMask from 'react-input-mask'

interface User {
  name: string
  email: string
  phone: string
  document: string
  birthDate: string
  doLiveAbroad: boolean
}

export function Form() {
  const [isForeigner, setIsForeigner] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
  const [cpf, setCpf] = useState<string>('')
  const [brPhone, setBrPhone] = useState<string>('')
  const [birthDate, setBirthDate] = useState<string>('')

  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    phone: '',
    document: '',
    birthDate: '',
    doLiveAbroad: isForeigner ? true : false,
  })

  const navigate = useNavigate()
  const currentPath = useLocation().pathname
  const { setUserData, isPolicyChecked } = useUser()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    const user_data = {
      name: user.name,
      email: user.email,
      phone: isForeigner ? user.phone : brPhone,
      document: isForeigner ? user.document : cpf,
      birthDate: birthDate,
      doLiveAbroad: user.doLiveAbroad,
    }

    setLoadingSubmit(true)

    setTimeout(async () => {
      try {
        const response = await quizUserAPI('/user/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          data: JSON.stringify({ user_data })
        })

        if (response.status === 200 || response.status === 201) {
          const token = response.data.token
          const user = response.status === 200 ? response.data.isUser : response.data.user

          setUserData({ user, token })
          localStorage.setItem('@quiz-devclub-v1:accessToken', token)
          localStorage.setItem('@quiz-devclub-v1:user', JSON.stringify(user))

          quizUserAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`

          navigate('/quiz')
        }
      } catch (error) {
        const handleError = await HandleAxiosAndGenericError(error)
        console.error('error message', handleError)
        ToastifyDisplay({ toastType: 'error', message: handleError })()
      } finally {
        setLoadingSubmit(false)
      }
    }, 1000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target

    setUser(prevUser => ({
      ...prevUser,
      [id]: value
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { checked } = e.target
    setIsForeigner(e.target.checked)
    setUser(prevUser => ({
      ...prevUser,
      doLiveAbroad: checked
    }))
  }

  const handleCPFInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCpf(e.target.value)
  }

  const handleBRNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setBrPhone(e.target.value)
  }

  const handleBirthDateInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setBirthDate(e.target.value)
  }

  useEffect(() => {
    if (!isPolicyChecked) {
      navigate('/')
    }
  }, [currentPath])

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />

      <div className="w-full min-lg:max-w-[515px] min-lg:mx-auto">
        <img src={mainBannerImg} alt="Banner oficial do evento" className="w-full object-cover mt-2 max-h-[270px]" />
      </div>

      <form className="w-full mt-4 flex-grow min-xs:max-w-[515px] min-xs:mx-auto" onSubmit={handleSubmit}>
        <h4 className="text-sm text-violet-500 font-bold text-center">Preencha seus dados para continuar</h4>

        <div className="p-5 flex flex-col gap-3 justify-center">
          <div className="flex items-center gap-1 w-full justify-center">
            <input
              type="checkbox"
              checked={isForeigner}
              onChange={handleCheckboxChange}
            />
            <p className="text-zinc-600 text-sm">Sou estrangeiro</p>
          </div>

          <div className="bg-zinc-100 rounded-sm w-full">
            <div className="relative">
              <RiUser3Line className="text-zinc-500 absolute left-2 top-1/2 -translate-y-1/2 transform" size={24} />
              <input
                id="name"
                type="text"
                className="h-12 w-full text-sm rounded-sm bg-transparent pl-9 pr-4 font-semibold outline-none border focus:border-violet-500 focus:ring focus:ring-violet-300 focus:ring-opacity-50 transition duration-200"
                placeholder="Seu nome completo"
                value={user.name}
                onChange={handleInputChange}
                required
                maxLength={128}
                minLength={3}
              />
            </div>
          </div>

          <div className=" bg-zinc-100 rounded-sm w-full">
            <div className="relative">
              <MdOutlineEmail className="text-zinc-500 absolute left-2 top-1/2 -translate-y-1/2 transform" size={24} />
              <input
                id="email"
                type="email"
                className="h-12 w-full text-sm rounded-sm bg-transparent pl-9 pr-4 font-semibold outline-none border focus:border-violet-500 focus:ring focus:ring-violet-300 focus:ring-opacity-50 transition duration-200"
                placeholder="Seu e-mail"
                value={user.email}
                onChange={handleInputChange}
                required
                maxLength={128}
              />
            </div>
          </div>

          <div className="bg-zinc-100 rounded-sm w-full">
            <div className="relative">
              <LuPhone className="text-zinc-500 absolute left-2 top-1/2 -translate-y-1/2 transform" size={22} />
              {isForeigner ?
                <input
                  id="phone"
                  type="text"
                  className="h-12 w-full text-sm rounded-sm bg-transparent pl-9 pr-4 font-semibold outline-none border focus:border-violet-500 focus:ring focus:ring-violet-300 focus:ring-opacity-50 transition duration-200"
                  placeholder="Seu Telefone + código do país"
                  value={user.phone}
                  onChange={handleInputChange}
                  required
                  maxLength={86}
                  minLength={6}
                /> :
                <InputMask
                  id="phone"
                  mask="(99) 99999-9999"
                  value={brPhone}
                  onChange={handleBRNumberInputChange}
                  className="h-12 w-full text-sm rounded-sm bg-transparent pl-9 pr-4 font-semibold outline-none border border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-300 focus:ring-opacity-50 transition duration-200"
                  placeholder="Seu telefone"
                  required
                />
              }
            </div>
          </div>

          <div className="bg-zinc-100 rounded-sm w-full">
            <div className="relative">
              <PiIdentificationCard className="text-zinc-500 absolute left-2 top-1/2 -translate-y-1/2 transform" size={24} />
              {isForeigner ?
                <input
                  id="document"
                  type="text"
                  className="h-12 w-full text-sm rounded-sm bg-transparent pl-9 pr-4 font-semibold outline-none border focus:border-violet-500 focus:ring focus:ring-violet-300 focus:ring-opacity-50 transition duration-200"
                  placeholder="Seu documento estrangeiro"
                  value={user.document}
                  onChange={handleInputChange}
                  required
                  maxLength={56}
                  minLength={4}
                /> :
                <InputMask
                  id="document"
                  mask="999.999.999-99"
                  value={cpf}
                  onChange={handleCPFInputChange}
                  className="h-12 w-full text-sm rounded-sm bg-transparent pl-9 pr-4 font-semibold outline-none border focus:border-violet-500 focus:ring focus:ring-violet-300 focus:ring-opacity-50 transition duration-200"
                  placeholder="Seu CPF"
                  required
                />
              }
            </div>
          </div>

          <div className="w-full bg-zinc-100 rounded-sm">
            <div className="relative">
              <MdOutlineDateRange className="text-zinc-500 absolute left-2 top-1/2 -translate-y-1/2 transform" size={24} />
              <InputMask
                id="birthDate"
                mask="99/99/9999"
                value={birthDate}
                onChange={handleBirthDateInputChange}
                className="h-12 w-full text-sm rounded-sm bg-transparent pl-9 pr-4 font-semibold outline-none border focus:border-violet-500 focus:ring focus:ring-violet-300 focus:ring-opacity-50 transition duration-200"
                placeholder="Sua data de aniversário"
                required
              />
            </div>
          </div>

          <button
            id="submit-user-data"
            type="submit"
            className="text-white bg-violet-500 h-14 rounded-sm shadow-sm w-full mt-4 font-bold uppercase text-sm hover:opacity-90 hover:transition-all"
            disabled={loadingSubmit}
          >
            {loadingSubmit ? 'Enviando...' : 'Acessar o Quiz'}
          </button>
        </div>
      </form>

      <Footer />
    </div>
  )
}
