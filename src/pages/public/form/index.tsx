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

import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Field,
  FieldLabel,
  FieldControl,
  Input,
  inputVariants,
} from '@devclub/ui'

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

          navigate('/feedback')
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

  const maskClassName = inputVariants({ inputSize: 'md' })

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />

      <main className="w-full flex-grow">
        <div className="mx-auto w-full max-w-lg px-4 pt-10 md:pt-14">
          <img src={mainBannerImg} alt="Banner oficial do evento" className="w-full object-cover max-h-[270px] rounded-xl" />
        </div>

        <div className="mx-auto w-full max-w-lg px-4 py-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-center">Preencha seus dados para continuar</CardTitle>
            </CardHeader>

            <CardContent>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <label className="flex items-center justify-center gap-2 select-none text-copy-sm text-fg-subtle">
                  <input
                    type="checkbox"
                    checked={isForeigner}
                    onChange={handleCheckboxChange}
                    className="size-4 accent-brand"
                  />
                  <span>Sou estrangeiro</span>
                </label>

                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <RiUser3Line className="text-fg-muted" size={18} />
                    Nome completo
                  </FieldLabel>
                  <FieldControl>
                    <Input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Seu nome completo"
                      value={user.name}
                      onChange={handleInputChange}
                      required
                      maxLength={128}
                      minLength={3}
                    />
                  </FieldControl>
                </Field>

                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <MdOutlineEmail className="text-fg-muted" size={18} />
                    E-mail
                  </FieldLabel>
                  <FieldControl>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="Seu e-mail"
                      value={user.email}
                      onChange={handleInputChange}
                      required
                      maxLength={128}
                    />
                  </FieldControl>
                </Field>

                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <LuPhone className="text-fg-muted" size={18} />
                    Telefone
                  </FieldLabel>
                  <FieldControl>
                    {isForeigner ?
                      <Input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
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
                        className={maskClassName}
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="Seu telefone"
                        required
                      />
                    }
                  </FieldControl>
                </Field>

                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <PiIdentificationCard className="text-fg-muted" size={18} />
                    {isForeigner ? 'Documento' : 'CPF'}
                  </FieldLabel>
                  <FieldControl>
                    {isForeigner ?
                      <Input
                        id="document"
                        type="text"
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
                        className={maskClassName}
                        inputMode="numeric"
                        placeholder="Seu CPF"
                        required
                      />
                    }
                  </FieldControl>
                </Field>

                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <MdOutlineDateRange className="text-fg-muted" size={18} />
                    Data de nascimento
                  </FieldLabel>
                  <FieldControl>
                    <InputMask
                      id="birthDate"
                      mask="99/99/9999"
                      value={birthDate}
                      onChange={handleBirthDateInputChange}
                      className={maskClassName}
                      autoComplete="bday"
                      inputMode="numeric"
                      placeholder="Sua data de aniversário"
                      required
                    />
                  </FieldControl>
                </Field>

                <Button
                  id="submit-user-data"
                  type="submit"
                  size="lg"
                  loading={loadingSubmit}
                  disabled={loadingSubmit}
                  className="w-full mt-2"
                >
                  {loadingSubmit ? 'Enviando...' : 'Acessar o Quiz'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
