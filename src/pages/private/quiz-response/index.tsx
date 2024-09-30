import { PrivateHeader } from "../../../components/PrivateHeader";

import mainBannerImg from "../../../assets/banner-min.png"

export function QuizResponse() {
  return (
    <div className="w-full h-screen">
      <PrivateHeader />

      <img src={mainBannerImg} alt="Banner oficial do evento" className="w-full object-cover mt-2" />
      <div className="w-full p-4">

        <div id="result-info" className="w-full mt-4">
          <h4 className="text-sm text-zinc-700 font-bold text-center">Parabéns! Você terminou de responder ao quiz do Desafio Devclub!</h4>

          <div className="flex items-center gap-2 justify-center mt-4">
            <p className="text-zinc-600 text-sm">Pontuação</p>
            <div className="rounded-md bg-blue-500 text-white p-3">
              2/10
            </div>
          </div>

          <p className="text-sm text-center text-blue-500 font-semibold mt-4">
            Lembrando que, para levar os prêmios, você precisa:
          </p>
        </div>

        <div id="rules-of-prize" className="mt-6">
          <ul className="flex flex-col gap-2 text-zinc-600 text-sm">
            <li>Ter acertado 7 questões ou mais neste quiz;</li>
            <li>Assistir até o final à aula ao vivo que vai acontecer no domingo, dia 29/09/2024 às 20h (horário de Brasília), no meu canal no Youtube;;</li>
            <li>Ser sorteado;</li>
            <li>Atender à ligação que eu farei, através do número de telefone que você cadastrou neste formulário;</li>
            <li>Responder à equipe, na ligação, a palavra-chave que eu vou dizer durante a aula.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}