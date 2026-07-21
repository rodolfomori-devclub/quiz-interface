import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  RadioGroup,
  RadioGroupItem,
  Textarea,
  cn,
} from '@devclub/ui'

import { Footer } from '../../../components/Footer'
import { PrivateHeader } from '../../../components/PrivateHeader'

import { quizUserAPI } from '../../../services/api'
import { useUser } from '../../../hooks/user'
import { HandleAxiosAndGenericError, ToastifyDisplay } from '../../../utils'

type Option = { value: string; label: string }

const attendanceOptions: Option[] = [
  { value: 'all', label: 'Todas' },
  { value: 'most', label: 'A maioria' },
  { value: 'one', label: 'Só uma' },
  { value: 'clips', label: 'Assisti só trechos/cortes' },
]

const consumptionFormatOptions: Option[] = [
  { value: 'live', label: 'Ao vivo' },
  { value: 'recorded', label: 'Gravadas' },
  { value: 'both', label: 'Um pouco de cada' },
]

const highlightOptions: Option[] = [
  { value: 'content', label: 'O conteúdo técnico' },
  { value: 'stories', label: 'As histórias de alunos' },
  { value: 'teaching', label: 'A didática do professor' },
  { value: 'community', label: 'A comunidade/energia do chat' },
]

const transformationOptions: Option[] = [
  { value: 'ready', label: 'Muito mais confiante, quero começar agora' },
  { value: 'confident_doubts', label: 'Mais confiante, mas ainda tenho dúvidas' },
  { value: 'same', label: 'Igual a antes' },
  { value: 'not_for_me', label: 'Percebi que não é para mim' },
]

const devclubStatusOptions: Option[] = [
  { value: 'student', label: 'Já sou aluno(a) 🎉' },
  { value: 'joining', label: 'Vou entrar agora' },
  { value: 'deciding', label: 'Ainda estou decidindo' },
  { value: 'not_joining', label: 'Não pretendo entrar' },
]

const obstacleOptions: Option[] = [
  { value: 'time', label: 'Falta de tempo' },
  { value: 'money', label: 'Questão financeira' },
  { value: 'insecurity', label: 'Insegurança/medo de não conseguir' },
  { value: 'family', label: 'Falta de apoio da família' },
  { value: 'other', label: 'Outro motivo' },
]

const DEVCLUB_STATUS_REQUIRING_OBSTACLE = ['deciding', 'not_joining']

interface FeedbackState {
  npsScore: number | null
  attendance: string
  consumptionFormat: string
  highlight: string
  transformation: string
  devclubStatus: string
  obstacle: string
  improvement: string
}

const initialFeedback: FeedbackState = {
  npsScore: null,
  attendance: '',
  consumptionFormat: '',
  highlight: '',
  transformation: '',
  devclubStatus: '',
  obstacle: '',
  improvement: '',
}

export function EventFeedback() {
  const navigate = useNavigate()
  const { userData } = useUser()

  const [showIntro, setShowIntro] = useState<boolean>(true)
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
  const [feedback, setFeedback] = useState<FeedbackState>(initialFeedback)

  const showObstacle = DEVCLUB_STATUS_REQUIRING_OBSTACLE.includes(feedback.devclubStatus)

  const handleSelect = (field: keyof FeedbackState, value: string | number) => {
    setFeedback(prev => {
      const next = { ...prev, [field]: value }
      // Se o usuário muda o status do DevClub para um que não pede obstáculo, limpamos a resposta anterior.
      if (field === 'devclubStatus' && !DEVCLUB_STATUS_REQUIRING_OBSTACLE.includes(String(value))) {
        next.obstacle = ''
      }
      return next
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (feedback.npsScore === null) {
      ToastifyDisplay({ toastType: 'warning', message: 'Escolha uma nota de 0 a 10 para a recomendação.' })()
      return
    }

    if (showObstacle && !feedback.obstacle) {
      ToastifyDisplay({ toastType: 'warning', message: 'Responda o que mais te impede de investir na carreira.' })()
      return
    }

    const event_feedback = {
      npsScore: feedback.npsScore,
      attendance: feedback.attendance,
      consumptionFormat: feedback.consumptionFormat,
      highlight: feedback.highlight,
      transformation: feedback.transformation,
      devclubStatus: feedback.devclubStatus,
      obstacle: showObstacle ? feedback.obstacle : null,
      improvement: feedback.improvement.trim() || null,
    }

    setLoadingSubmit(true)

    try {
      const response = await quizUserAPI('/user/event-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData?.token}`,
        },
        data: JSON.stringify({ event_feedback }),
      })

      if (response.status === 201 || response.status === 200) {
        navigate('/quiz')
      }
    } catch (error) {
      const handleError = await HandleAxiosAndGenericError(error)
      console.error('error message', handleError)
      ToastifyDisplay({ toastType: 'error', message: handleError })()
    } finally {
      setLoadingSubmit(false)
    }
  }

  return (
    <div className="w-full min-h-screen">
      <PrivateHeader />

      <div className="w-full py-6">
        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl px-4 space-y-6 pb-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Antes do quiz, conta pra gente 🙏</CardTitle>
              <CardDescription>
                Queremos saber o que você achou do evento. São perguntas rapidinhas e logo em seguida começa o quiz.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* 1. NPS */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-h5">
                De 0 a 10, quanto você recomendaria o evento para um amigo?
              </CardTitle>
              <CardDescription>0 = de jeito nenhum · 10 = com certeza</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2 sm:grid-cols-11">
                {Array.from({ length: 11 }, (_, i) => i).map(score => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => handleSelect('npsScore', score)}
                    className={cn(
                      'h-10 rounded-md border font-mono text-sm font-bold transition-colors',
                      'outline-none focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2',
                      feedback.npsScore === score
                        ? 'border-brand bg-brand text-on-brand'
                        : 'border-line bg-component text-fg-subtle hover:bg-surface-hover'
                    )}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <SingleChoice
            title="Quantas aulas do evento você assistiu?"
            name="attendance"
            options={attendanceOptions}
            selected={feedback.attendance}
            onSelect={value => handleSelect('attendance', value)}
          />

          <SingleChoice
            title="Como você acompanhou as aulas?"
            name="consumptionFormat"
            options={consumptionFormatOptions}
            selected={feedback.consumptionFormat}
            onSelect={value => handleSelect('consumptionFormat', value)}
          />

          <SingleChoice
            title="O que mais te marcou no evento?"
            name="highlight"
            options={highlightOptions}
            selected={feedback.highlight}
            onSelect={value => handleSelect('highlight', value)}
          />

          <SingleChoice
            title="Depois do evento, como você se sente em relação a se tornar programador(a)?"
            name="transformation"
            options={transformationOptions}
            selected={feedback.transformation}
            onSelect={value => handleSelect('transformation', value)}
          />

          <SingleChoice
            title="Você já entrou ou pretende entrar para o DevClub?"
            name="devclubStatus"
            options={devclubStatusOptions}
            selected={feedback.devclubStatus}
            onSelect={value => handleSelect('devclubStatus', value)}
          />

          {showObstacle && (
            <SingleChoice
              title="O que mais te impede de investir na carreira de programação hoje?"
              name="obstacle"
              options={obstacleOptions}
              selected={feedback.obstacle}
              onSelect={value => handleSelect('obstacle', value)}
            />
          )}

          {/* Campo aberto opcional */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-h5">O que você gostaria que melhorasse no evento?</CardTitle>
              <CardDescription>Opcional</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={feedback.improvement}
                onChange={e => setFeedback(prev => ({ ...prev, improvement: e.target.value }))}
                placeholder="Conta pra gente! Pode ser sobre conteúdo, horário, formato..."
                rows={4}
                maxLength={1000}
                className="resize-none"
              />
            </CardContent>
          </Card>

          <div className="flex w-full md:justify-center">
            <Button type="submit" size="lg" loading={loadingSubmit} className="w-full md:w-1/2">
              Continuar para o quiz
            </Button>
          </div>
        </form>
      </div>

      <Footer />

      <Dialog
        open={showIntro}
        onOpenChange={open => {
          if (!open) setShowIntro(false)
        }}
      >
        <DialogContent hideClose className="max-w-md">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-brand-subtle text-3xl">🙏</div>
            <DialogHeader className="items-center gap-1.5 pr-0 text-center">
              <DialogTitle className="font-display text-h5">Antes do quiz, uma coisinha rápida!</DialogTitle>
              <DialogDescription>
                Queremos saber o que você achou do evento — são só algumas perguntas rapidinhas.
              </DialogDescription>
            </DialogHeader>
            <p className="text-copy-sm text-fg-subtle">
              Logo em seguida começam as perguntas do quiz. Boa sorte! 🚀
            </p>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setShowIntro(false)} className="w-full">
              Vamos lá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface SingleChoiceProps {
  title: string
  name: string
  options: Option[]
  selected: string
  onSelect: (value: string) => void
}

function SingleChoice({ title, name, options, selected, onSelect }: SingleChoiceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-h5">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup name={name} value={selected} onValueChange={onSelect} required>
          {options.map(option => (
            <label
              key={option.value}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors',
                selected === option.value
                  ? 'border-brand bg-brand-subtle'
                  : 'border-line bg-component hover:bg-surface-hover'
              )}
            >
              <RadioGroupItem value={option.value} />
              <span className="text-copy-sm text-fg md:text-copy">{option.label}</span>
            </label>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
