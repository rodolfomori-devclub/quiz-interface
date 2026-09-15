// Contrato do fluxo "Diploma do evento" (sem quiz), compartilhado pelo front público e pelo admin.
// Espelha as respostas de quiz-api/src/controllers/public/DiplomaController.js e
// quiz-api/src/controllers/admin/DiplomaAdminController.js — mudou lá, muda aqui.

export type DiplomaQuestionType = 'nps' | 'multi'

export interface DiplomaOption {
  id: string
  label: string
}

export interface DiplomaQuestion {
  id: string
  type: DiplomaQuestionType
  title: string
  // Só em 'multi'.
  options?: DiplomaOption[]
}

export interface DiplomaMba {
  question: string
  yesTitle: string
  yesOptions: DiplomaOption[]
  noTitle: string
  noOptions: DiplomaOption[]
}

// Só existe no admin: nunca é enviado ao participante.
export interface DiplomaKeyword {
  id: string
  answer: string
  variations: string[]
}

// GET / PUT /admin/events/:id/diploma-config
export interface DiplomaConfig {
  questions: DiplomaQuestion[]
  mba: DiplomaMba
  keywords: DiplomaKeyword[]
}

// GET /public/diploma/:slug
export interface DiplomaPublicConfig {
  id: string
  name: string
  slug: string
  isActive: boolean
  questions: DiplomaQuestion[]
  mba: DiplomaMba
  keywordCount: number
}

export type DiplomaStep = 'feedback' | 'keywords' | 'done'

// POST /public/diploma/:slug/submissions  (201 criado / 200 retomado)
// GET  /public/diploma/submissions/:id
export interface DiplomaSessionResponse {
  submissionId: string
  eventSlug: string
  name: string
  step: DiplomaStep
  certificateUrl?: string
}

export interface DiplomaLeadPayload {
  name: string
  email: string
  phone: string
  doLiveAbroad: boolean
  consent: boolean
}

export interface DiplomaAnswerPayload {
  questionId: string
  score?: number
  optionIds?: string[]
}

export interface DiplomaMbaPayload {
  intent: boolean
  reasons: string[]
  // Preenchido = "Outro" marcado.
  other: string | null
}

// PUT /public/diploma/submissions/:id/answers
export interface DiplomaAnswersPayload {
  answers: DiplomaAnswerPayload[]
  mba: DiplomaMbaPayload
}

export interface DiplomaAnswersResponse {
  step: 'keywords'
  keywordCount: number
}

// POST /public/diploma/submissions/:id/attempts
export interface DiplomaAttemptPayload {
  keywords: string[]
}

export type DiplomaAttemptResponse = { passed: false; message: string } | { passed: true; certificateUrl: string }

// Snapshot gravado na submissão (títulos e rótulos copiados no momento da resposta).
export type DiplomaAnswerSnapshot =
  | { questionId: string; type: 'nps'; title: string; score: number }
  | { questionId: string; type: 'multi'; title: string; optionIds: string[]; labels: string[] }

export interface DiplomaAttempt {
  id: string
  inputs: string[]
  passed: boolean
  createdAt: string
}

// GET /admin/events/:id/diploma-submissions (datas em ISO string)
export interface DiplomaSubmission {
  id: string
  eventId: string
  name: string
  email: string
  phone: string
  doLiveAbroad: boolean
  consentAt: string
  answers: DiplomaAnswerSnapshot[] | null
  mbaIntent: boolean | null
  mbaReasons: DiplomaOption[] | null
  mbaOther: string | null
  answersSubmittedAt: string | null
  passedAt: string | null
  createdAt: string
  updatedAt: string
  attemptsCount: number
  lastAttempt: DiplomaAttempt | null
  certificateUrl: string | null
}

// POST /admin/diploma/keywords/test
export interface DiplomaKeywordTestPayload {
  keywords: DiplomaKeyword[]
  inputs: string[]
}

export interface DiplomaKeywordTestResponse {
  passed: boolean
  normalized: string[]
}
