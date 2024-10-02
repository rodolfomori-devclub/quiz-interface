import { Routes, Route } from 'react-router-dom'

import Home from '../../pages/index'
import { Form } from '../../pages/public/form'
import { AdminLogin } from '../../pages/admin/login'

import { NotFound } from '../../pages/NotFound'

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/preencher" element={<Form />} />

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
