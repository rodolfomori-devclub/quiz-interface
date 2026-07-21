import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"

import { Badge } from "@devclub/ui"

import { useUser } from "../../hooks/user"
import { quizAdminAPI } from "../../services/api"
import { Wordmark } from "../Wordmark"
import { BrandControls } from "../BrandControls"

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
    <header className="w-full border-t-2 border-brand">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <Wordmark size="sm" />
          <Badge variant="brand" className="hidden sm:inline-flex">admin</Badge>
        </div>

        <div className="flex items-center gap-2">
          <BrandControls />
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
