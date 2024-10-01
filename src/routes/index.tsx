import { BrowserRouter } from 'react-router-dom'

import { useUser } from '../hooks/user'

import { AppRoutes } from './user/app.routes'
import { AuthRoutes } from './user/auth.routes'

export function Routes() {
  const { userData } = useUser()

  return <BrowserRouter>{userData?.token ? <AppRoutes /> : <AuthRoutes />}</BrowserRouter>
}
