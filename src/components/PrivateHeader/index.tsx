import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"

import { useUser } from "../../hooks/user"
import { quizUserAPI } from "../../services/api"
import { Wordmark } from "../Wordmark"
import { BrandControls } from "../BrandControls"

export const PrivateHeader = () => {
  const { userData, setUserData } = useUser()
  const navigate = useNavigate()

  const handleSignOut = (): void => {
    localStorage.removeItem('@quiz-devclub-v1:accessToken')
    localStorage.removeItem('@quiz-devclub-v1:user')

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
    <header className="w-full border-t-2 border-brand">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Wordmark size="sm" />
          <BrandControls />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-line pt-3">
          <span className="flex min-w-0 flex-col">
            <p className="truncate text-copy-sm text-fg-subtle">Olá, <b className="text-fg">{userData?.user?.name}</b></p>
            <i className="truncate text-label-sm text-fg-muted">{userData?.user?.email}</i>
          </span>

          <button
            onClick={() => handleSignOut()}
            type="button"
            className="inline-flex items-center gap-1.5 text-label font-medium uppercase tracking-caps text-fg-subtle transition-colors hover:text-fg-brand"
          >
            <LogOut className="size-4" />
            Sair
          </button>
        </div>
      </div>
      <div className="border-b border-line" />
    </header>
  )
}
