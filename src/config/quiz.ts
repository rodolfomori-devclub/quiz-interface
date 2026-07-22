// Nota mínima (0-10) para aprovação / elegibilidade ao sorteio.
export const PASSING_GRADE = 7

// Chaves de localStorage (prefixo @quiz-devclub-v1:).
export const STORAGE_KEYS = {
  accessToken: '@quiz-devclub-v1:accessToken',
  user: '@quiz-devclub-v1:user',
  // Setado APENAS quando aprovado (>= 7): trava definitiva.
  passedLock: '@quiz-devclub-v1:alreadyFilledQuiz',
  // Timestamp (ms) em que um reprovado poderá refazer o quiz.
  canRetryAt: '@quiz-devclub-v1:canRetryAt',
  // Última nota, para sobreviver ao refresh na tela de resultado.
  finalGrade: '@quiz-devclub-v1:finalGrade',
} as const
