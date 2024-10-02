import { FormEventHandler, useState } from "react"

import { Header } from "../../../components/Header"

import { MdOutlineEmail } from "react-icons/md"
import { RiLockPasswordLine } from "react-icons/ri"

import { useUser } from "../../../hooks/user"
import { useNavigate } from "react-router-dom"
import { quizAdminAPI } from "../../../services/api"
import { HandleAxiosAndGenericError, ToastifyDisplay } from "../../../utils"

export function AdminLogin() {
  const [admin, setAdmin] = useState({
    email: '',
    password: '',
  })
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)

  const { setAdminData } = useUser()
  const navigate = useNavigate()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    setLoadingSubmit(true)

    setTimeout(async () => {
      try {
        const response = await quizAdminAPI('/admin/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          data: JSON.stringify({ admin })
        })

        if (response.status === 200) {
          const token = response.data.token
          const admin = response.data.isAdmin

          setAdminData({ admin, token })
          localStorage.setItem('@quiz-devclub-v1:adminAccessToken', token)
          localStorage.setItem('@quiz-devclub-v1:admin', JSON.stringify(admin))

          quizAdminAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`

          navigate('/admin/dashboard')
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

    setAdmin(prevAdmin => ({
      ...prevAdmin,
      [id]: value
    }))
  }

  return (
    <div className="w-full min-h-screen">
      <Header />

      <div className="w-full p-4 flex-grow min-lg:max-w-[415px] min-lg:mx-auto mt-40">
        <form onSubmit={handleSubmit} id="admin-login-form" className="w-full mt-4 flex-grow min-xs:max-w-[415px] min-xs:mx-auto flex flex-col gap-4">
          <div className=" bg-zinc-100 rounded-sm w-full">
            <div className="relative">
              <MdOutlineEmail className="text-zinc-500 absolute left-2 top-1/2 -translate-y-1/2 transform" size={24} />
              <input
                id="email"
                type="email"
                className="h-12 w-full text-sm rounded-sm bg-transparent pl-9 pr-4 font-semibold outline-none border focus:border-violet-500 focus:ring focus:ring-violet-300 focus:ring-opacity-50 transition duration-200"
                placeholder="Seu e-mail"
                value={admin.email}
                onChange={handleInputChange}
                required
                maxLength={128}
              />
            </div>
          </div>

          <div className=" bg-zinc-100 rounded-sm w-full">
            <div className="relative">
              <RiLockPasswordLine className="text-zinc-500 absolute left-2 top-1/2 -translate-y-1/2 transform" size={24} />
              <input
                id="password"
                type="password"
                className="h-12 w-full text-sm rounded-sm bg-transparent pl-9 pr-4 font-semibold outline-none border focus:border-violet-500 focus:ring focus:ring-violet-300 focus:ring-opacity-50 transition duration-200"
                placeholder="Senha"
                value={admin.password}
                onChange={handleInputChange}
                required
                maxLength={128}
              />
            </div>
          </div>

          <button
            id="admin-login"
            type="submit"
            className="text-white bg-violet-500 h-14 rounded-sm shadow-sm w-full mt-4 font-bold uppercase text-sm"
            disabled={loadingSubmit}
          >
            {loadingSubmit ? 'Enviando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}