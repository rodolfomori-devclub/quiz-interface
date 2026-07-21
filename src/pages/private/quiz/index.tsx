import { Footer } from "../../../components/Footer"
import { PrivateHeader } from "../../../components/PrivateHeader"

import mainBannerImg from "../../../assets/banner-min.png"

import { FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { quizUserAPI } from "../../../services/api"
import { HandleAxiosAndGenericError, ToastifyDisplay } from "../../../utils"
import { useUser } from "../../../hooks/user"
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  cn,
} from "@devclub/ui"

interface RightAnswer {
  id: string
  answer: string
}

interface Answer {
  id: string
  description: string
  isAnswerCorrect: boolean
}

interface Question {
  id: string
  question: string
  answers: Answer[]
  rightAnswer?: RightAnswer
  createdAt: Date
  updatedAt: Date
}

type SelectedAnswers = {
  [questionId: string]: string
}

export function Quiz() {
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({})
  const [quizData, setQuizData] = useState<Question[]>([])
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
  const [keywords, setKeywords] = useState<string[]>(['', '', '', ''])

  const navigate = useNavigate()
  const { userData, setUserFinalGrade, setCertificate } = useUser()

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId,
    }))
  }

  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...keywords]
    newKeywords[index] = value
    setKeywords(newKeywords)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    const userStorage = localStorage.getItem('@quiz-devclub-v1:alreadyFilledQuiz')

    if (userStorage) {
      ToastifyDisplay({ toastType: 'warning', message: 'Só é possível preencher o QUIZ uma vez.' })()
      return
    }

    const user_selected_answers = {
      userId: userData?.user.id,
      quizResponse: selectedAnswers,
      keywords
    }

    setLoadingSubmit(true)

    setTimeout(async () => {
      try {
        const response = await quizUserAPI('/user/answer-quiz', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${userData?.token}`
          },
          data: JSON.stringify({ user_selected_answers })
        })

        if (response.status === 200) {
          setUserFinalGrade(response.data.finalGrade)
          setCertificate(response.data.certificateUrl)
          localStorage.setItem('@quiz-devclub-v1:alreadyFilledQuiz', 'true')
          navigate('/resultado')
        }
      } catch (error) {
        const handleError = await HandleAxiosAndGenericError(error)
        console.error('error message', handleError)
        ToastifyDisplay({ toastType: 'error', message: handleError })()
      } finally {
        setLoadingSubmit(false)
      }
    }, 1500)
  }

  const handleQueryQuiz = async (): Promise<void> => {
    try {
      const response = await quizUserAPI('/admin/list-question', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 200) {
        setQuizData(response.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    handleQueryQuiz()
  }, [])

  return (
    <div className="w-full min-h-screen">
      <PrivateHeader />

      <div className="w-full p-4">

        <div className="mx-auto w-full max-w-5xl pt-4 md:pt-6">
          <img src={mainBannerImg} alt="Banner oficial do evento" className="w-full object-cover max-h-[270px] rounded-xl" />
        </div>

        <form onSubmit={handleSubmit} className="mx-auto mt-6 flex w-full max-w-5xl flex-grow flex-col space-y-8 pb-4">
          {quizData.map((question) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="font-display text-h5">{question.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.answers.map((answer) => {
                  const isSelected = selectedAnswers[question.id] === answer.id
                  return (
                    <label
                      key={answer.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                        isSelected
                          ? "border-brand bg-brand-subtle"
                          : "border-line bg-component hover:bg-surface-hover"
                      )}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={answer.id}
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(question.id, answer.id)}
                        className="h-4 w-4 shrink-0 accent-brand"
                        required
                      />
                      <span className="text-copy-sm text-fg md:text-copy">{answer.description}</span>
                    </label>
                  )
                })}
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-h5">Quais são as 4 palavras chave?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {keywords.map((keyword, index) => (
                <Input
                  key={index}
                  type="text"
                  value={keyword}
                  onChange={(e) => handleKeywordChange(index, e.target.value)}
                  placeholder={`Palavra chave aula ${index + 1}`}
                  required
                  autoComplete="off"
                />
              ))}
            </CardContent>
          </Card>

          <div className="w-full md:flex md:justify-center">
            <Button
              type="submit"
              size="lg"
              loading={loadingSubmit}
              className="mt-8 w-full md:w-1/2"
            >
              {loadingSubmit ? 'Enviando respostas...' : 'Enviar Respostas'}
            </Button>
          </div>

        </form>
      </div>

      <Footer />
    </div>
  )
}
