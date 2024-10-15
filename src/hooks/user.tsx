import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react'

import { quizAdminAPI, quizUserAPI } from '../services/api'

export type AdminRole = 'master-admin' | 'default-admin'

export interface User {
  id?: string
  name?: string
  email?: string
  phone?: string
  document?: string
  alreadyFilledQuiz?: boolean | null
  finalGrade?: number | null
  birthDate?: string | Date
  doLiveAbroad?: boolean
  keywords?: string[]
  createdAt?: Date | null
  updatedAt?: Date | null
}

interface Admin {
  id?: string
  name?: string
  email?: string
}

interface AuthContextData {
  userData: UserAuthAccess
  setUserData: React.Dispatch<React.SetStateAction<UserAuthAccess>>
  userFinalGrade: number | null
  setUserFinalGrade: React.Dispatch<React.SetStateAction<number | null>>
  adminData: AdminAuthAcess
  setAdminData: React.Dispatch<React.SetStateAction<AdminAuthAcess>>
}

interface AuthProviderProps {
  children: ReactNode
}

interface UserAuthAccess {
  user: User
  token: string
}

interface AdminAuthAcess {
  admin: Admin
  token: string
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

function UserProvider({ children }: AuthProviderProps) {
  const [userData, setUserData] = useState<UserAuthAccess>({
    user: {},
    token: '',
  })

  const [adminData, setAdminData] = useState<AdminAuthAcess>({
    admin: {},
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

  useEffect(() => {
    const adminToken = localStorage.getItem('@quiz-devclub-v1:adminAccessToken')
    const admin = localStorage.getItem('@quiz-devclub-v1:admin')

    if (adminToken && admin) {
      quizAdminAPI.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`
      setAdminData({
        admin: JSON.parse(admin),
        token: adminToken,
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
        adminData,
        setAdminData,
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
