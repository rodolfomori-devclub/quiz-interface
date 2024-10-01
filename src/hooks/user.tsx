import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react'

import { quizUserAPI } from '../services/api'

export type AdminRole = 'master-admin' | 'default-admin'

interface User {
  id?: string
  name?: string
  email?: string
  alreadyFilledQuiz?: boolean | null
  finalGrade?: number | null
  createdAt?: Date | null
  updatedAt?: Date | null
}

interface AuthContextData {
  userData: UserAuthAccess
  setUserData: React.Dispatch<React.SetStateAction<UserAuthAccess>>
  userFinalGrade: number | null
  setUserFinalGrade: React.Dispatch<React.SetStateAction<number | null>>
}

interface AuthProviderProps {
  children: ReactNode
}

interface UserAuthAccess {
  user: User
  token: string
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

function UserProvider({ children }: AuthProviderProps) {
  const [userData, setUserData] = useState<UserAuthAccess>({
    user: {},
    token: '',
  })

  const [userFinalGrade, setUserFinalGrade] = useState<number | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('@quiz-devclub-v1:accessToken')
    const user = localStorage.getItem('@quiz-devclub-v1:user')

    if (token && user) {
      quizUserAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUserData({
        user: JSON.parse(user),
        token,
      })
    }
  }, [])


  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        userFinalGrade,
        setUserFinalGrade,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useUser() {
  const context = useContext(AuthContext)

  return context
}

export { UserProvider, useUser }
