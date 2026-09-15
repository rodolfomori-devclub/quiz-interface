// Nota mínima (0-10) para aprovação / elegibilidade ao sorteio.
export const PASSING_GRADE = 7

const PREFIX = '@quiz-devclub-v1:'

// Chaves de localStorage globais (não dependem de evento).
export const STORAGE_KEYS = {
  accessToken: PREFIX + 'accessToken',
  user: PREFIX + 'user',
  adminAccessToken: PREFIX + 'adminAccessToken',
  admin: PREFIX + 'admin',
  // Evento atual da sessão (para escopar as chaves de quiz abaixo).
  eventId: PREFIX + 'eventId',
  eventName: PREFIX + 'eventName',
} as const

// Chaves de quiz ESCOPADAS por evento — assim um lead que volta num evento novo
// não é bloqueado por flags de um evento anterior.
export function quizKeys(eventId: string) {
  return {
    // Setado APENAS quando aprovado (>= 7) naquele evento: trava definitiva.
    passedLock: `${PREFIX}alreadyFilledQuiz:${eventId}`,
    // Timestamp (ms) em que um reprovado poderá refazer o quiz do evento.
    canRetryAt: `${PREFIX}canRetryAt:${eventId}`,
    // Última nota do evento, para sobreviver ao refresh na tela de resultado.
    finalGrade: `${PREFIX}finalGrade:${eventId}`,
  }
}

// Chaves do fluxo diploma, escopadas por evento. Não tocam em STORAGE_KEYS nem na sessão do quiz.
export function diplomaKeys(eventId: string) {
  return {
    // uuid da submissão: funciona como chave de acesso para retomar após refresh.
    submissionId: `${PREFIX}diplomaSubmissionId:${eventId}`,
    // Rascunho { answers, mba } das etapas Avaliação e MBA; apagado ao liberar o diploma.
    draft: `${PREFIX}diplomaDraft:${eventId}`,
  }
}

export function getCurrentEventId(): string {
  return localStorage.getItem(STORAGE_KEYS.eventId) || ''
}
