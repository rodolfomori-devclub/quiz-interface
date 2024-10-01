import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import { useUser } from '../hooks/user'

export function NotFound() {
  const { userData } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (userData?.token) {
      navigate('/quiz')
    } else {
      navigate('/')
    }
  }, [userData, navigate])

  return null
}
