import { EventFeedback } from '../hooks/user'

type LabelMap = Record<string, string>

export const attendanceLabels: LabelMap = {
  all: 'Todas',
  most: 'A maioria',
  one: 'Só uma',
  clips: 'Só trechos/cortes',
}

export const consumptionFormatLabels: LabelMap = {
  live: 'Ao vivo',
  recorded: 'Gravadas',
  both: 'Um pouco de cada',
}

export const highlightLabels: LabelMap = {
  content: 'Conteúdo técnico',
  stories: 'Histórias de alunos',
  teaching: 'Didática do professor',
  community: 'Comunidade/chat',
}

export const transformationLabels: LabelMap = {
  ready: 'Muito mais confiante, quero começar agora',
  confident_doubts: 'Mais confiante, mas ainda com dúvidas',
  same: 'Igual a antes',
  not_for_me: 'Percebeu que não é para si',
}

export const devclubStatusLabels: LabelMap = {
  student: 'Já é aluno(a)',
  joining: 'Vai entrar agora',
  deciding: 'Ainda decidindo',
  not_joining: 'Não pretende entrar',
}

export const obstacleLabels: LabelMap = {
  time: 'Falta de tempo',
  money: 'Questão financeira',
  insecurity: 'Insegurança/medo',
  family: 'Falta de apoio da família',
  other: 'Outro motivo',
}

const EMPTY = '—'

export function label(map: LabelMap, value?: string | null): string {
  if (!value) return EMPTY
  return map[value] ?? value
}

// Campos legíveis do feedback, prontos para exibição e exportação.
export function feedbackToReadable(feedback?: EventFeedback | null) {
  const nps = feedback?.npsScore
  return {
    nps: nps === null || nps === undefined ? EMPTY : String(nps),
    attendance: label(attendanceLabels, feedback?.attendance),
    consumptionFormat: label(consumptionFormatLabels, feedback?.consumptionFormat),
    highlight: label(highlightLabels, feedback?.highlight),
    transformation: label(transformationLabels, feedback?.transformation),
    devclubStatus: label(devclubStatusLabels, feedback?.devclubStatus),
    obstacle: label(obstacleLabels, feedback?.obstacle),
    improvement: feedback?.improvement?.trim() || EMPTY,
  }
}
