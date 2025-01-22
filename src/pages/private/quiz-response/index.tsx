import { Footer } from "../../../components/Footer"
import { PrivateHeader } from "../../../components/PrivateHeader"

import mainBannerImg from "../../../assets/banner-min.png"

import { useUser } from "../../../hooks/user"

import { IoMdArrowDropright } from "react-icons/io"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function QuizResponse() {
  const { userFinalGrade, certificateUrl } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (userFinalGrade! <= 6) {
      localStorage.removeItem('@quiz-devclub-v1:alreadyFilledQuiz')
    }
  }, [userFinalGrade])

  const handleNavigateUserToQuizResponse = () => {
    navigate('/quiz')
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <PrivateHeader />

      <div className="w-full min-lg:max-w-[1063px] min-lg:mx-auto">
        <img src={mainBannerImg} alt="Banner oficial do evento" className="w-full object-cover mt-2 max-h-[270px]" />
      </div>

      <div className="w-full p-4 flex-grow min-lg:max-w-[1063px] min-lg:mx-auto">
        <div id="result-info" className="w-full mt-4">
          <h4 className="text-sm min-md:text-base text-zinc-700 font-bold text-center">Parabéns! Você terminou de responder ao QUIZ do MISSÃO PROGRAMAÇÃO DO ZERO.</h4>
          {userFinalGrade! >= 7 ? <label className="flex justify-center my-4">
            <a href={certificateUrl} download className="text-sm min-md:text-base text-violet-500 font-bold cursor-pointer hover:opacity-80">Clique aqui para receber seu certificado agora mesmo</a>
          </label>
            :
            <label className="flex flex-col items-center gap-2 justify-center my-4">
              <p className="text-zinc-600 text-sm min-md:text-base">Opss, você não tirou a nota mínima...</p>
              <button type="button" onClick={handleNavigateUserToQuizResponse} className="text-violet-500 font-bold hover:opacity-80">Tentar novamente o QUIZ</button>
            </label>
          }

          <div className="flex items-center gap-2 justify-center mt-4">
            <p className="text-zinc-600 text-sm min-md:text-base">Pontuação</p>
            <div className="rounded-md bg-violet-500 text-white p-3 shadow-md">
              {userFinalGrade}/10
            </div>
          </div>

          <p className="text-sm min-md:text-base text-center text-violet-500 font-semibold mt-4">
            Lembrando que, para levar os prêmios, você precisa:
          </p>
        </div>

        <div id="rules-of-prize" className="mt-6">
          <ul className="flex flex-col gap-2 text-zinc-600 text-sm min-md:text-base">
            <li className="flex items-center"><IoMdArrowDropright className="text-zinc-300" size={26} style={{ minWidth: '26px', marginRight: '2px' }} />Ter acertado 7 questões ou mais neste quiz (70% da prova);</li>
            <li className="flex items-center"><IoMdArrowDropright className="text-zinc-300" size={26} style={{ minWidth: '26px', marginRight: '2px' }} />Assistir todas as aulas AO VIVO comigo;</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  )
}