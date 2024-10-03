import { useNavigate } from "react-router-dom"

import { useUser } from "../../hooks/user"
import { quizAdminAPI } from "../../services/api"

export const AdminPrivateHeader = () => {
  const { setAdminData } = useUser()
  const navigate = useNavigate()

  const handleSignOut = (): void => {
    localStorage.removeItem('@quiz-devclub-v1:adminAccessToken')
    localStorage.removeItem('@quiz-devclub-v1:admin')

    delete quizAdminAPI.defaults.headers.common['Authorization']

    setAdminData({
      admin: {
        id: '',
        name: '',
        email: '',
      },
      token: ''
    })
    navigate('/admin/login')
  }

  return (
    <header className="w-full h-[150px] border-t-4 border-violet-500 mx-auto flex flex-col justify-center gap-4 min-md:max-w-[720px]">
      <div className="w-full">
        <h2 className="text-xl font-semibold text-violet-600 text-center uppercase">Desafio da</h2>
        <h1 className="font-semibold uppercase tracking-[0.2rem] text-2xl text-center"><b className="text-slate-900">Gestão de Tráfego</b></h1>
      </div>

      <div className="w-full flex justify-end px-5 min-md:px-0">
        <span className="self-end items-end justify-end">
          <button onClick={() => handleSignOut()} type="button" className="uppercase text-zinc-600 text-sm font-semibold hover:opacity-80 hover:transition-all">Sair</button>
        </span>
      </div>
    </header>
  )
}