import { Footer } from "../../../components/Footer"
import { PrivateHeader } from "../../../components/PrivateHeader"

import mainBannerImg from "../../../assets/banner-min.png"

import { useUser } from "../../../hooks/user"

export function QuizResponse() {
  const { userFinalGrade } = useUser()

  return (
    <div className="w-full min-h-screen flex flex-col">
      <PrivateHeader />

      <div className="w-full min-lg:max-w-[1063px] min-lg:mx-auto">
        <img src={mainBannerImg} alt="Banner oficial do evento" className="w-full object-cover mt-2 max-h-[270px]" />
      </div>

      <div className="w-full p-4 flex-grow min-lg:max-w-[1063px] min-lg:mx-auto">
        <div id="result-info" className="w-full mt-4">
          <h4 className="text-sm min-md:text-base text-zinc-700 font-bold text-center">Parabéns! Você terminou de responder ao quiz do Desafio Devclub!</h4>

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
            <li>Ter acertado 7 questões ou mais neste quiz;</li>
            <li>Assistir até o final à aula ao vivo que vai acontecer no domingo, dia 29/09/2024 às 20h (horário de Brasília), no meu canal no Youtube;</li>
            <li>Ser sorteado;</li>
            <li>Atender à ligação que eu farei, através do número de telefone que você cadastrou neste formulário;</li>
            <li>Responder à equipe, na ligação, a palavra-chave que eu vou dizer durante a aula.</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  )
}