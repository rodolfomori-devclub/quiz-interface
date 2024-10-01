import { Routes, Route } from 'react-router-dom'

import { Quiz } from '../../pages/private/quiz'
import { QuizResponse } from '../../pages/private/quiz-response'

import { NotFound } from '../../pages/NotFound'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/resultado" element={<QuizResponse />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
