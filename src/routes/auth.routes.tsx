import { Routes, Route } from 'react-router-dom'

import Home from '../pages/index'
import { Form } from '../pages/public/form'
import { Quiz } from '../pages/private/quiz'
import { QuizResponse } from '../pages/private/quiz-response'

import { NotFound } from '../pages/NotFound'

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/preencher" element={<Form />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/resultado" element={<QuizResponse />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
