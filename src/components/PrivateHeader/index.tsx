import { useNavigate } from "react-router-dom"

import { useUser } from "../../hooks/user"
import { quizUserAPI } from "../../services/api"

export const PrivateHeader = () => {
  const { userData, setUserData } = useUser()
  const navigate = useNavigate()

  const handleSignOut = (): void => {
    localStorage.removeItem('@quiz-devclub-v1:accessToken')
    localStorage.removeItem('@quiz-devclub-v1:user')
    localStorage.removeItem('@quiz-devclub-v1:alreadyFilledQuiz')
    localStorage.removeItem('@quiz-devclub-v1:userFinalGrade')

    delete quizUserAPI.defaults.headers.common['Authorization']

    setUserData({
      user: {
        id: '',
        name: '',
        email: '',
        alreadyFilledQuiz: null,
        finalGrade: null,
        createdAt: null,
        updatedAt: null,
      },
      token: ''
    })
    navigate('/')
  }

  return (
    <header className="w-full h-[150px] border-t-4 border-primary mx-auto flex flex-col justify-center gap-4 min-md:max-w-[720px]">
      <div className="w-full">
        <h2 className="text-xl font-semibold text-primary text-center uppercase">Desafio do</h2>
        <h1 className="font-semibold uppercase tracking-[0.2rem] text-2xl text-center"><b className="text-secondary">QUIZ</b></h1>
      </div>

      <div className="w-full flex items-center justify-between px-6">
        <span className="flex flex-col gap-0.5">
          <p className="text-neutral-600 text-sm">Olá, <b>{userData?.user?.name}</b></p><i className="text-sm">{userData?.user?.email}</i>
        </span>

        <span>
          <button onClick={() => handleSignOut()} type="button" className="uppercase text-neutral-600 text-sm hover:opacity-80 hover:transition-all">Sair</button>
        </span>
      </div>
    </header>
  )
}