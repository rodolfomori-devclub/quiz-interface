import { Routes, Route } from 'react-router-dom'

import { NotFound } from '../../pages/NotFound'
import { AdminDashboard } from '../../pages/admin/dashboard'

export function AdminAppRoutes() {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
