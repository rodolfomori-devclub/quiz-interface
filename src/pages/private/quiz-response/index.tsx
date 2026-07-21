import { Footer } from "../../../components/Footer"
import { PrivateHeader } from "../../../components/PrivateHeader"

import mainBannerImg from "../../../assets/banner-min.png"

import { useUser } from "../../../hooks/user"

import { Button, StatCard } from "@devclub/ui"
import { CheckCircle } from "lucide-react"

export function QuizResponse() {
  const { userFinalGrade, certificate } = useUser()

  return (
    <div className="w-full min-h-screen flex flex-col">
      <PrivateHeader />

      <div className="w-full px-4 pt-6 md:pt-8 lg:max-w-5xl lg:mx-auto">
        <img src={mainBannerImg} alt="Banner oficial do evento" className="w-full object-cover max-h-[270px] rounded-xl" />
      </div>

      <div className="w-full flex-grow px-4 py-6 lg:max-w-5xl lg:mx-auto">
        <div id="result-info" className="w-full mt-4 flex flex-col items-center">
          <h4 className="font-display text-h4 md:text-h3 text-fg text-center">Parabéns! Você terminou de responder ao QUIZ do Programador em 72h - o desafio.</h4>

          <div className="mt-6 w-full max-w-xs">
            <StatCard
              label="SUA NOTA"
              value={<span className="font-mono">{userFinalGrade}/10</span>}
              variant="glow"
            />
          </div>

          {certificate && userFinalGrade! >= 7 ? (
            <div className="mt-8 text-center">
              <Button asChild size="lg">
                <a
                  href={certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  📄 Baixar Certificado
                </a>
              </Button>
            </div>
          ) : ''}

          <p className="text-copy md:text-copy-lg text-center text-fg-brand font-semibold mt-8">
            Lembrando que, para levar os prêmios, você precisa:
          </p>
        </div>

        <div id="rules-of-prize" className="mt-6 flex justify-center">
          <ul className="flex flex-col gap-3 text-fg-subtle text-copy md:text-copy-lg">
            <li className="flex items-start gap-2"><CheckCircle className="text-fg-brand shrink-0 mt-0.5" size={22} />Ter acertado 7 questões ou mais neste quiz (70% da prova);</li>
            <li className="flex items-start gap-2"><CheckCircle className="text-fg-brand shrink-0 mt-0.5" size={22} />Assistir todas as aulas AO VIVO comigo;</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  )
}
