import { Routes, Route } from 'react-router-dom'

import { NotFound } from '../../pages/NotFound'
import { AdminDashboard } from '../../pages/admin/dashboard'
import { DiplomaPage } from '../../pages/public/diploma'
import { PrivacyPolicy } from '../../pages/public/policy'

export function AdminAppRoutes() {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      {/* Públicas também com o admin logado (para testar o link do diploma). */}
      <Route path="/d/:slug" element={<DiplomaPage />} />
      <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
