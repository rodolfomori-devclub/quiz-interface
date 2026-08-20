import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import { Quiz } from '../../pages/private/quiz'
import { QuizResponse } from '../../pages/private/quiz-response'
import { EventFeedback } from '../../pages/private/feedback'

import { NotFound } from '../../pages/NotFound'

import { useUser } from '../../hooks/user'
import { STORAGE_KEYS } from '../../config/quiz'

// Um lead com token antigo que clica no link de OUTRO evento: limpamos a sessão
// para o app voltar às rotas públicas e ele se cadastrar no evento do link.
function EventLinkReset() {
  const { setUserData } = useUser()

  useEffect(() => {
    localStorage.removeItem(STORAGE_KEYS.accessToken)
    localStorage.removeItem(STORAGE_KEYS.user)
    setUserData({ user: {}, token: '' })
  }, [])

  return null
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/feedback" element={<EventFeedback />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/resultado" element={<QuizResponse />} />
      <Route path="/e/:slug" element={<EventLinkReset />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
