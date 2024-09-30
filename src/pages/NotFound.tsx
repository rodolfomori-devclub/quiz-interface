import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export function NotFound() {
  const userDataToken = 'some-user-token'
  const adminDataToken = ''
  const navigate = useNavigate()

  useEffect(() => {
    if (userDataToken) {
      navigate('/')
    } else if (adminDataToken) {
      navigate('/')
    } else {
      navigate('/')
    }
  }, [userDataToken, adminDataToken, navigate])

  return null
}
