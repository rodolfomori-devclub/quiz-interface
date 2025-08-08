import { Footer } from "../../../components/Footer"
import { PrivateHeader } from "../../../components/PrivateHeader"

import mainBannerImg from "../../../assets/banner-min.png"

import { useUser } from "../../../hooks/user"

export function QuizResponse() {
  const { userFinalGrade, certificate } = useUser()

  return (
    <div className="w-full min-h-screen flex flex-col">
      <PrivateHeader />

      <div className="w-full min-lg:max-w-[1063px] min-lg:mx-auto">
        <img src={mainBannerImg} alt="Banner oficial do evento" className="w-full object-cover mt-2 max-h-[270px]" />
      </div>

      <div className="w-full p-4 flex-grow min-lg:max-w-[1063px] min-lg:mx-auto">
        <div id="result-info" className="w-full mt-4">
          <h4 className="text-sm min-md:text-base text-neutral-700 font-bold text-center">Parabéns! Você terminou de responder ao QUIZ do Programador em 7 dias.</h4>

          <div className="flex flex-col items-center gap-2 justify-center mt-4">
            <p className="text-neutral-600 text-sm min-md:text-base">Pontuação</p>
            <div className="rounded-md bg-primary text-white p-3 shadow-md">
              {userFinalGrade}/10
            </div>
          </div>

          {certificate && userFinalGrade! >= 7 ? (
            <div className="mt-8 text-center">
              <a
                href={certificate}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-md shadow-md transition-colors"
              >
                📄 Baixar Certificado
              </a>
            </div>
          ) : ''}

        </div>

      </div>

      <Footer />
    </div>
  )
}