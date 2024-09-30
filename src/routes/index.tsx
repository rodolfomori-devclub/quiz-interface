import { BrowserRouter } from 'react-router-dom'
import { AuthRoutes } from './auth.routes'

export function Routes() {
  // const adminToken = ''
  // const userToken = 'some-user-token'

  return <BrowserRouter><AuthRoutes /></BrowserRouter>
}
