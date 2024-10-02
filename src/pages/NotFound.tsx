import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import { useUser } from '../hooks/user'

export function NotFound() {
  const { userData, adminData } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (userData?.token) {
      navigate('/quiz')
    } else if (adminData?.token) {
      navigate('/admin/dashboard')
    } else {
      navigate('/')
    }
  }, [userData, adminData, navigate])

  return null
}
