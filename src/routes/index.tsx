import { BrowserRouter } from 'react-router-dom'

import { useUser } from '../hooks/user'

import { AppRoutes } from './user/app.routes'
import { AuthRoutes } from './user/auth.routes'
import { AdminAppRoutes } from './admin/app.routes'

export function Routes() {
  const { userData, adminData } = useUser()

  return <BrowserRouter>{adminData?.token ? <AdminAppRoutes /> : userData?.token ? <AppRoutes /> : <AuthRoutes />}</BrowserRouter>
}
