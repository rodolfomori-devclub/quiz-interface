import { FormEventHandler, useState } from "react"

import { Header } from "../../../components/Header"

import { Mail, Lock } from "lucide-react"
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
} from "@devclub/ui"

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

      <div className="mx-auto w-full max-w-sm px-4 mt-40">
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Acesso administrativo</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              id="admin-login-form"
              className="flex flex-col gap-4"
            >
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-fg-muted" aria-hidden="true" />
                  E-mail
                </FieldLabel>
                <FieldControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Seu e-mail"
                    value={admin.email}
                    onChange={handleInputChange}
                    required
                    maxLength={128}
                  />
                </FieldControl>
              </Field>

              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-fg-muted" aria-hidden="true" />
                  Senha
                </FieldLabel>
                <FieldControl>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Senha"
                    value={admin.password}
                    onChange={handleInputChange}
                    required
                    maxLength={128}
                  />
                </FieldControl>
              </Field>

              <Button
                id="admin-login"
                type="submit"
                size="lg"
                loading={loadingSubmit}
                className="mt-2 w-full"
              >
                {loadingSubmit ? 'Enviando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
