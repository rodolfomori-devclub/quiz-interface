import { useEffect, useState } from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  IconButton,
  Input,
  Spinner,
  cn,
} from '@devclub/ui'

import { AdminQuestion } from '../../../hooks/user'
import { quizAdminAPI } from '../../../services/api'
import { ToastifyDisplay } from '../../../utils'

interface QuestionsEditorProps {
  eventId: string
  token?: string
  eventName?: string
}

type DraftAnswer = { id?: string; description: string; isAnswerCorrect: boolean }
type Draft = { id: string | null; question: string; answers: DraftAnswer[] }

function toDraft(q: AdminQuestion): Draft {
  return {
    id: q.id,
    question: q.question,
    answers: q.answers.map((a) => ({ id: a.id, description: a.description, isAnswerCorrect: a.isAnswerCorrect })),
  }
}

function validate(d: Draft): string | null {
  if (!d.question.trim()) return 'O enunciado da pergunta é obrigatório.'
  if (d.answers.length < 2) return 'A pergunta precisa de pelo menos 2 alternativas.'
  if (d.answers.some((a) => !a.description.trim())) return 'Todas as alternativas precisam de texto.'
  if (d.answers.filter((a) => a.isAnswerCorrect).length !== 1) return 'Marque exatamente uma alternativa correta.'
  return null
}

export function QuestionsEditor({ eventId, token, eventName }: QuestionsEditorProps) {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [savingKey, setSavingKey] = useState<string | null>(null)

  const auth = { Authorization: `Bearer ${token}` }

  const load = async (): Promise<void> => {
    if (!eventId) return
    setLoading(true)
    try {
      const res = await quizAdminAPI(`/admin/events/${eventId}/questions`, { method: 'GET', headers: auth })
      setDrafts((res.data as AdminQuestion[]).map(toDraft))
    } catch (error) {
      ToastifyDisplay({ toastType: 'error', message: 'Erro ao carregar as perguntas.' })()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId])

  const updateQuestion = (qi: number, question: string) =>
    setDrafts((ds) => ds.map((d, i) => (i === qi ? { ...d, question } : d)))

  const updateAnswerText = (qi: number, ai: number, description: string) =>
    setDrafts((ds) =>
      ds.map((d, i) => (i === qi ? { ...d, answers: d.answers.map((a, j) => (j === ai ? { ...a, description } : a)) } : d))
    )

  const setCorrect = (qi: number, ai: number) =>
    setDrafts((ds) =>
      ds.map((d, i) => (i === qi ? { ...d, answers: d.answers.map((a, j) => ({ ...a, isAnswerCorrect: j === ai })) } : d))
    )

  const addAnswer = (qi: number) =>
    setDrafts((ds) =>
      ds.map((d, i) => (i === qi ? { ...d, answers: [...d.answers, { description: '', isAnswerCorrect: false }] } : d))
    )

  const removeAnswer = (qi: number, ai: number) =>
    setDrafts((ds) => ds.map((d, i) => (i === qi ? { ...d, answers: d.answers.filter((_, j) => j !== ai) } : d)))

  const addQuestion = () =>
    setDrafts((ds) => [
      ...ds,
      {
        id: null,
        question: '',
        answers: [
          { description: '', isAnswerCorrect: true },
          { description: '', isAnswerCorrect: false },
        ],
      },
    ])

  const save = async (qi: number): Promise<void> => {
    const d = drafts[qi]
    const err = validate(d)
    if (err) {
      ToastifyDisplay({ toastType: 'warning', message: err })()
      return
    }
    const key = d.id ?? `new-${qi}`
    setSavingKey(key)
    const question_data = {
      question: d.question.trim(),
      answers: d.answers.map((a) => ({ description: a.description.trim(), isAnswerCorrect: a.isAnswerCorrect })),
    }
    try {
      if (d.id) {
        await quizAdminAPI(`/admin/questions/${d.id}`, {
          method: 'PUT',
          headers: { ...auth, 'Content-Type': 'application/json' },
          data: JSON.stringify({ question_data }),
        })
      } else {
        await quizAdminAPI(`/admin/events/${eventId}/questions`, {
          method: 'POST',
          headers: { ...auth, 'Content-Type': 'application/json' },
          data: JSON.stringify({ question_data }),
        })
      }
      ToastifyDisplay({ toastType: 'success', message: 'Pergunta salva.' })()
      await load()
    } catch (error) {
      ToastifyDisplay({ toastType: 'error', message: 'Erro ao salvar a pergunta.' })()
    } finally {
      setSavingKey(null)
    }
  }

  const remove = async (qi: number): Promise<void> => {
    const d = drafts[qi]
    if (!d.id) {
      setDrafts((ds) => ds.filter((_, i) => i !== qi))
      return
    }
    if (!window.confirm('Excluir esta pergunta?')) return
    try {
      await quizAdminAPI(`/admin/questions/${d.id}`, { method: 'DELETE', headers: auth })
      ToastifyDisplay({ toastType: 'success', message: 'Pergunta excluída.' })()
      await load()
    } catch (error) {
      ToastifyDisplay({ toastType: 'error', message: 'Erro ao excluir a pergunta.' })()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <h3 className="text-h5 font-semibold text-fg">Perguntas do evento{eventName ? ` · ${eventName}` : ''}</h3>
          <p className="text-copy-sm text-fg-subtle">{drafts.length} pergunta(s). Marque a alternativa correta com o ✓.</p>
        </div>
        <Button size="sm" variant="secondary" onClick={addQuestion}>
          <Plus className="size-4" /> Adicionar pergunta
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner className="size-6 text-fg-muted" /></div>
      ) : drafts.length === 0 ? (
        <p className="text-copy-sm text-fg-muted py-6 text-center">Nenhuma pergunta neste evento ainda.</p>
      ) : (
        drafts.map((d, qi) => (
          <Card key={d.id ?? `new-${qi}`}>
            <CardHeader>
              <CardTitle className="text-label font-medium text-fg-muted">Pergunta {qi + 1}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Input
                value={d.question}
                onChange={(e) => updateQuestion(qi, e.target.value)}
                placeholder="Digite o enunciado da pergunta"
              />

              <div className="flex flex-col gap-2">
                {d.answers.map((a, ai) => (
                  <div key={ai} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCorrect(qi, ai)}
                      title="Marcar como correta"
                      className={cn(
                        'shrink-0 rounded-md border p-2 transition-colors',
                        a.isAnswerCorrect
                          ? 'border-success-line bg-success-bg text-success-fg'
                          : 'border-line text-fg-muted hover:text-fg'
                      )}
                    >
                      <Check className="size-4" />
                    </button>
                    <Input
                      value={a.description}
                      onChange={(e) => updateAnswerText(qi, ai, e.target.value)}
                      placeholder={`Alternativa ${ai + 1}`}
                    />
                    <IconButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      label="Remover alternativa"
                      onClick={() => removeAnswer(qi, ai)}
                    >
                      <Trash2 />
                    </IconButton>
                  </div>
                ))}
                <Button size="sm" variant="ghost" onClick={() => addAnswer(qi)} className="self-start">
                  <Plus className="size-4" /> Alternativa
                </Button>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button size="sm" onClick={() => save(qi)} loading={savingKey === (d.id ?? `new-${qi}`)}>
                  Salvar
                </Button>
                <Button size="sm" variant="outline" onClick={() => remove(qi)}>
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
