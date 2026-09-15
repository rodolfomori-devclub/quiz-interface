import * as XLSX from 'xlsx'

import type {
  DiplomaAnswerSnapshot,
  DiplomaConfig,
  DiplomaKeyword,
  DiplomaMba,
  DiplomaOption,
  DiplomaQuestion,
  DiplomaQuestionType,
  DiplomaSubmission,
} from '../types/diploma'

// ---------- Formatação ----------

const onlyDigits = (value: string | null | undefined): string => String(value ?? '').replace(/\D/g, '')

/** WhatsApp para exibição: máscara brasileira ou os dígitos crus de quem mora fora. */
export function formatPhone(digits: string, abroad: boolean): string {
  const d = onlyDigits(digits)
  if (abroad) return d
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return d
}

// O telefone é gravado sem DDI: número brasileiro ganha o 55, estrangeiro vai como veio.
export function whatsappLink(digits: string, abroad: boolean): string {
  const d = onlyDigits(digits)
  return `https://wa.me/${abroad ? d : `55${d}`}`
}

export function formatDateTime(iso: string | null | undefined, withSeconds = false): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: withSeconds ? 'medium' : 'short' })
}

const yesNo = (value: boolean): string => (value ? 'Sim' : 'Não')

/** Resposta de uma pergunta no snapshot da submissão: a nota ou os rótulos marcados. */
export function answerText(sub: DiplomaSubmission, questionId: string): string {
  const answer = sub.answers?.find(a => a.questionId === questionId)
  if (!answer) return ''
  return answer.type === 'nps' ? String(answer.score) : answer.labels.join('; ')
}

// ---------- Agregação (aba Resultados) ----------

export interface BarRow {
  label: string
  count: number
}

export interface NpsResult {
  type: 'nps'
  questionId: string
  title: string
  answered: number
  avg: number | null
  score: number | null
  promoters: number
  passives: number
  detractors: number
}

export interface MultiResult {
  type: 'multi'
  questionId: string
  title: string
  answered: number
  rows: BarRow[]
}

export interface MbaResult {
  answered: number
  yes: number
  no: number
  yesRows: BarRow[]
  noRows: BarRow[]
  others: { name: string; intent: boolean; text: string }[]
}

export interface DiplomaAggregate {
  respondents: number
  questions: (NpsResult | MultiResult)[]
  mba: MbaResult
}

const REMOVED = ' (removida)'

type NpsSnapshot = Extract<DiplomaAnswerSnapshot, { type: 'nps' }>
type MultiSnapshot = Extract<DiplomaAnswerSnapshot, { type: 'multi' }>

// Mesma conta do FeedbackResults: promotores 9-10, neutros 7-8, detratores 0-6.
function npsStats(values: number[]) {
  if (values.length === 0) return { avg: null, score: null, promoters: 0, passives: 0, detractors: 0 }
  const promoters = values.filter(v => v >= 9).length
  const passives = values.filter(v => v >= 7 && v <= 8).length
  const detractors = values.filter(v => v <= 6).length
  const avg = values.reduce((a, b) => a + b, 0) / values.length
  const score = Math.round(((promoters - detractors) / values.length) * 100)
  return { avg, score, promoters, passives, detractors }
}

// Opções da config primeiro (na ordem dela); as que só existem em respostas antigas entram no fim como "(removida)".
function countOptions(current: DiplomaOption[], picks: DiplomaOption[][]): BarRow[] {
  const rows = new Map<string, BarRow>()
  current.forEach(o => rows.set(o.id, { label: o.label, count: 0 }))
  picks.forEach(list => {
    new Set(list.map(o => o.id)).forEach(id => {
      const row = rows.get(id) ?? { label: `${list.find(o => o.id === id)?.label ?? id}${REMOVED}`, count: 0 }
      row.count += 1
      rows.set(id, row)
    })
  })
  return [...rows.values()]
}

export function aggregateDiploma(subs: DiplomaSubmission[], config: DiplomaConfig): DiplomaAggregate {
  const answeredSubs = subs.filter(s => s.answersSubmittedAt && s.answers)
  const snapshots = answeredSubs.flatMap(s => s.answers ?? [])

  // Perguntas que saíram da config mas ainda aparecem em respostas antigas.
  const known = new Set(config.questions.map(q => q.id))
  const removed: DiplomaQuestion[] = []
  snapshots.forEach(a => {
    if (known.has(a.questionId)) return
    known.add(a.questionId)
    removed.push({ id: a.questionId, type: a.type, title: `${a.title}${REMOVED}`, options: [] })
  })

  const questions = [...config.questions, ...removed].map((q): NpsResult | MultiResult => {
    if (q.type === 'nps') {
      const values = snapshots.filter((a): a is NpsSnapshot => a.questionId === q.id && a.type === 'nps').map(a => a.score)
      return { type: 'nps', questionId: q.id, title: q.title, answered: values.length, ...npsStats(values) }
    }
    const answers = snapshots.filter((a): a is MultiSnapshot => a.questionId === q.id && a.type === 'multi')
    const picks = answers.map(a => a.optionIds.map((id, i) => ({ id, label: a.labels[i] ?? id })))
    return { type: 'multi', questionId: q.id, title: q.title, answered: answers.length, rows: countOptions(q.options ?? [], picks) }
  })

  const withIntent = subs.filter(s => typeof s.mbaIntent === 'boolean')
  const reasonRows = (options: DiplomaOption[], list: DiplomaSubmission[]): BarRow[] => [
    ...countOptions(
      options,
      list.map(s => s.mbaReasons ?? []),
    ),
    { label: 'Outro (texto livre)', count: list.filter(s => (s.mbaOther ?? '').trim() !== '').length },
  ]
  const yesSubs = withIntent.filter(s => s.mbaIntent === true)
  const noSubs = withIntent.filter(s => s.mbaIntent === false)

  return {
    respondents: answeredSubs.length,
    questions,
    mba: {
      answered: withIntent.length,
      yes: yesSubs.length,
      no: noSubs.length,
      yesRows: reasonRows(config.mba.yesOptions, yesSubs),
      noRows: reasonRows(config.mba.noOptions, noSubs),
      others: withIntent
        .filter(s => (s.mbaOther ?? '').trim() !== '')
        .map(s => ({ name: s.name, intent: s.mbaIntent === true, text: (s.mbaOther ?? '').trim() })),
    },
  }
}

// ---------- Exportação ----------

export function exportDiplomaXLSX(subs: DiplomaSubmission[], config: DiplomaConfig, eventName: string): void {
  // Array de linhas (e não json_to_sheet) para títulos de pergunta repetidos não sobrescreverem colunas.
  const header = [
    '#',
    'Nome',
    'E-mail',
    'WhatsApp',
    'Estrangeiro',
    'Data',
    ...config.questions.map(q => q.title),
    'Pretende MBA',
    'Motivos MBA',
    'Outro (MBA)',
    'Diploma liberado',
    'Liberado em',
    'Tentativas',
    'Últimas palavras digitadas',
  ]

  const rows = subs.map((sub, index) => [
    index + 1,
    sub.name,
    sub.email,
    formatPhone(sub.phone, sub.doLiveAbroad),
    yesNo(sub.doLiveAbroad),
    formatDateTime(sub.createdAt),
    ...config.questions.map(q => answerText(sub, q.id)),
    typeof sub.mbaIntent === 'boolean' ? yesNo(sub.mbaIntent) : '',
    (sub.mbaReasons ?? []).map(r => r.label).join('; '),
    sub.mbaOther ?? '',
    yesNo(Boolean(sub.passedAt)),
    formatDateTime(sub.passedAt),
    sub.attemptsCount,
    sub.lastAttempt ? sub.lastAttempt.inputs.join(' | ') : '',
  ])

  const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Diplomas')
  const safeName = (eventName || 'evento').replace(/[^a-z0-9]+/gi, '_').toLowerCase()
  XLSX.writeFile(workbook, `diploma_${safeName}.xlsx`)
}

// ---------- Rascunho do editor de configuração ----------

// `key` é só a chave local do React; `id` vazio = item novo (o servidor gera o id ao salvar).
export interface DraftOption {
  key: string
  id: string
  label: string
}

export interface DraftQuestion {
  key: string
  id: string
  type: DiplomaQuestionType
  title: string
  options: DraftOption[]
}

export interface DraftKeyword {
  key: string
  id: string
  answer: string
  variations: string[]
}

export interface DiplomaDraft {
  questions: DraftQuestion[]
  mba: { question: string; yesTitle: string; noTitle: string; yesOptions: DraftOption[]; noOptions: DraftOption[] }
  keywords: DraftKeyword[]
}

// Corpo do PUT: igual ao DiplomaConfig, mas item novo vai sem id.
type WithOptionalId<T extends { id: string }> = Omit<T, 'id'> & { id?: string }
export interface DiplomaConfigPayload {
  questions: (Omit<WithOptionalId<DiplomaQuestion>, 'options'> & { options?: WithOptionalId<DiplomaOption>[] })[]
  mba: Omit<DiplomaMba, 'yesOptions' | 'noOptions'> & { yesOptions: WithOptionalId<DiplomaOption>[]; noOptions: WithOptionalId<DiplomaOption>[] }
  keywords: WithOptionalId<DiplomaKeyword>[]
}

let keySeq = 0
export const newKey = (): string => `tmp-${++keySeq}`

export const emptyOption = (): DraftOption => ({ key: newKey(), id: '', label: '' })
export const emptyKeyword = (): DraftKeyword => ({ key: newKey(), id: '', answer: '', variations: [] })

export function moveItem<T>(list: T[], index: number, delta: number): T[] {
  const target = index + delta
  if (target < 0 || target >= list.length) return list
  const next = [...list]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

const toDraftOptions = (options: DiplomaOption[] = []): DraftOption[] => options.map(o => ({ key: o.id || newKey(), id: o.id, label: o.label }))

export function toDraft(config: DiplomaConfig): DiplomaDraft {
  const keywords = config.keywords.map(k => ({ key: k.id || newKey(), id: k.id, answer: k.answer, variations: [...k.variations] }))
  // Sem palavras-chave ainda, o editor já abre com os 2 cartões do padrão.
  if (keywords.length === 0) keywords.push(emptyKeyword(), emptyKeyword())

  return {
    questions: config.questions.map(q => ({ key: q.id || newKey(), id: q.id, type: q.type, title: q.title, options: toDraftOptions(q.options) })),
    mba: {
      question: config.mba.question,
      yesTitle: config.mba.yesTitle,
      noTitle: config.mba.noTitle,
      yesOptions: toDraftOptions(config.mba.yesOptions),
      noOptions: toDraftOptions(config.mba.noOptions),
    },
    keywords,
  }
}

const optionalId = (id: string) => (id ? { id } : {})
const optionsPayload = (options: DraftOption[]) => options.map(o => ({ ...optionalId(o.id), label: o.label.trim() }))

// Cartão totalmente vazio não é enviado (nem para salvar, nem para testar).
export const keywordsPayload = (keywords: DraftKeyword[]): WithOptionalId<DiplomaKeyword>[] =>
  keywords.filter(k => k.answer.trim() !== '' || k.variations.length > 0).map(k => ({ ...optionalId(k.id), answer: k.answer.trim(), variations: k.variations }))

export function toPayload(draft: DiplomaDraft): DiplomaConfigPayload {
  return {
    questions: draft.questions.map(q => ({
      ...optionalId(q.id),
      type: q.type,
      title: q.title.trim(),
      // Opções guardadas de quando a pergunta era múltipla escolha não vão numa pergunta de nota.
      ...(q.type === 'multi' ? { options: optionsPayload(q.options) } : {}),
    })),
    mba: {
      question: draft.mba.question.trim(),
      yesTitle: draft.mba.yesTitle.trim(),
      noTitle: draft.mba.noTitle.trim(),
      yesOptions: optionsPayload(draft.mba.yesOptions),
      noOptions: optionsPayload(draft.mba.noOptions),
    },
    keywords: keywordsPayload(draft.keywords),
  }
}

function optionsError(options: DraftOption[], where: string): string | null {
  if (options.some(o => !o.label.trim())) return `Preencha todas as opções ${where}.`
  const labels = options.map(o => o.label.trim().toLowerCase())
  if (new Set(labels).size !== labels.length) return `Há opções repetidas ${where}.`
  if (options.length > 30) return `Use no máximo 30 opções ${where}.`
  return null
}

/** Espelha as validações do servidor para avisar antes do PUT. */
export function validateDraft(draft: DiplomaDraft, isActive: boolean): string | null {
  if (draft.questions.length > 30) return 'Use no máximo 30 perguntas de avaliação.'

  for (const [index, q] of draft.questions.entries()) {
    const n = index + 1
    if (!q.title.trim()) return `Preencha o título da pergunta ${n}.`
    if (q.title.trim().length > 300) return `O título da pergunta ${n} passa de 300 caracteres.`
    if (q.type === 'multi') {
      if (q.options.length < 2) return `A pergunta ${n} precisa de pelo menos 2 opções.`
      const error = optionsError(q.options, `da pergunta ${n}`)
      if (error) return error
    }
  }

  const { mba } = draft
  if (!mba.question.trim()) return 'Preencha a pergunta do MBA.'
  const mbaError = optionsError(mba.yesOptions, 'dos motivos do Sim') ?? optionsError(mba.noOptions, 'dos motivos do Não')
  if (mbaError) return mbaError
  if (isActive && (mba.yesOptions.length === 0 || mba.noOptions.length === 0)) {
    return 'Com o evento ativo, cadastre ao menos 1 motivo no Sim e 1 no Não.'
  }

  const filled = draft.keywords.filter(k => k.answer.trim() !== '' || k.variations.length > 0)
  if (filled.some(k => !k.answer.trim())) return 'Toda palavra-chave com variações precisa da palavra principal.'
  if (filled.length === 0) return 'Cadastre ao menos 1 palavra-chave.'
  if (filled.length > 5) return 'Use no máximo 5 palavras-chave.'
  if (filled.some(k => k.answer.trim().length > 120)) return 'A palavra principal pode ter até 120 caracteres.'
  if (filled.some(k => k.variations.length > 50)) return 'Cada palavra-chave aceita até 50 variações.'

  return null
}
