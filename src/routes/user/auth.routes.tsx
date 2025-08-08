import { Route, Routes } from 'react-router-dom'

import { Form } from '../../pages/public/form'
import { PrivacyPolicy } from '../../pages/public/policy'

import { NotFound } from '../../pages/NotFound'

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Form />} />
      <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
