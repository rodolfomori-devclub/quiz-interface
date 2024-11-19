import { Footer } from "../../../components/Footer"
import { PrivateHeader } from "../../../components/PrivateHeader"

import mainBannerImg from "../../../assets/banner-min.png"

import { FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { quizUserAPI } from "../../../services/api"
import { HandleAxiosAndGenericError, ToastifyDisplay } from "../../../utils"
import { useUser } from "../../../hooks/user"

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
  const { userData, setUserFinalGrade } = useUser()

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

      <div className="w-full h-full bg-gray-100 p-4">

        <div className="w-full min-lg:max-w-[1063px] min-lg:mx-auto">
          <img src={mainBannerImg} alt="Banner oficial do evento" className="w-full object-cover mt-2 max-h-[270px]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 pb-4 flex-grow min-lg:max-w-[1063px] min-lg:mx-auto">
          {quizData.map((question) => (
            <div key={question.id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-sm min-md:text-base font-bold mb-4">{question.question}</h2>
              <div className="space-y-4">
                {question.answers.map((answer) => (
                  <label
                    key={answer.id}
                    className="flex items-center space-x-3 p-2 bg-gray-50 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={answer.id}
                      checked={selectedAnswers[question.id] === answer.id}
                      onChange={() => handleAnswerSelect(question.id, answer.id)}
                      className="form-radio text-green-600"
                      required
                    />
                    <span className="text-gray-700 text-sm min-md:text-base">{answer.description}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-sm min-md:text-base font-bold mb-4">Quais são as 3 palavras chave?</h2>
            <div className="space-y-4">
              {keywords.map((keyword, index) => (
                <input
                  key={index}
                  type="text"
                  value={keyword}
                  onChange={(e) => handleKeywordChange(index, e.target.value)}
                  placeholder={`Palavra chave aula ${index + 1}`}
                  className="w-full p-2 rounded outline-none border focus:border-violet-500 focus:ring focus:ring-violet-300 focus:ring-opacity-50 transition duration-200 text-sm"
                  required
                  autoComplete="off"
                />
              ))}
            </div>
          </div>

          <div className="w-full min-md:flex min-md:justify-center">
            <button
              type="submit"
              className="w-full py-3 bg-violet-500 text-white font-bold rounded-lg shadow hover:opacity-90 hover:transition-all transition duration-300 mt-8 min-md:w-[50%]"
              disabled={loadingSubmit}
            >
              {loadingSubmit ? 'Enviando respostas...' : 'Enviar Respostas'}
            </button>
          </div>

        </form>
      </div>

      <Footer />
    </div>
  )
}
