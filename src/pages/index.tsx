import { useEffect, useState } from "react"

import { Header } from "../components/Header"
import { Footer } from "../components/Footer"

import mainBannerImg from '../assets/banner-min.png'

import { useNavigate } from "react-router-dom"
import { ArrowUp, ChevronRight } from "lucide-react"

import { Button, Card, CardContent, Checkbox } from "@devclub/ui"

import { useUser } from "../hooks/user"

function Home() {
  const { setIsPolicyChecked, isPolicyChecked } = useUser()
  const [showScrollTopButton, setShowScrollTopButton] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleNavigate = (): void => {
    if (isPolicyChecked) {
      navigate('/preencher')
    } else {
      alert('Você precisa concordar com os termos para continuar.')
    }
  }

  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTopButton(true)
      } else {
        setShowScrollTopButton(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }
    , [])

  const drawRules = [
    {
      question: "Até quando eu posso fazer o quiz?",
      answer: "Até às 20h (horário de Brasília) de domingo.",
    },
    {
      question: "Todo mundo que respondeu ao quiz participará do sorteio?",
      answer: "NÃO. Apenas as pessoas que fizerem o QUIZ e acertarem 70% ou mais da prova serão elegíveis e participarão do sorteio.",
    },
    {
      question: "Basta ser sorteado e o notebook será meu?",
      answer: "NÃO. Como vai funcionar? É preciso que você cumpra todos os critérios: (1) esteja ao vivo comigo em todas as aulas, (2) responda corretamente pelo menos 70% do quiz.",
    },
    {
      question: "Eu posso responder o quiz mais de uma vez para ter mais chances de ser sorteado?",
      answer: "NÃO. A resposta está vinculada ao CPF e cada pessoa tem direito a apenas uma resposta. Isso garante a lisura do sorteio, excluindo a possibilidade de entrada dupla na lista e eliminando de fato as pessoas que, por não terem participado do Missão Programação do Zero, sejam reprovadas.",
    },
    {
      question: "Apenas uma pessoa vai receber todos os prêmios?",
      answer: "Sim. Será realizado um único sorteio, de apenas um notebook.",
    },
  ]

  return (
    <div className="w-full min-h-screen pt-6 md:pt-10">
      <Header />

      <div className="w-full lg:max-w-5xl lg:mx-auto px-4 pt-10 md:pt-14">
        <img src={mainBannerImg} alt="Banner oficial do evento" className="w-full object-cover max-h-[270px] rounded-xl" />
      </div>

      <section className="w-full px-4 py-6 flex-grow mx-auto max-w-5xl">
        <p className="font-pixel text-eyebrow uppercase tracking-caps text-fg-brand">Desafio do</p>
        <h3 className="font-display text-h4 md:text-h3 text-fg mt-1">Quiz DevClub</h3>

        <p className="text-fg-subtle mt-3 text-copy md:text-copy-lg">Seja muito bem-vindo ao <b className="text-fg font-semibold">Quiz DevClub.</b></p>

        <p className="text-fg-subtle mt-4 text-copy-sm md:text-copy">A finalidade deste QUIZ é, primeiro, ajudar a absorver todo o conteúdo que eu dei nas aulas do DevClub, colocando seu conhecimento, recém adquirido na prática, segundo, parabenizar e bonificar aqueles que comprovarem ter aprendido tudo o que foi ensinado. Por isso, quem acertar 70% (setenta por cento) ou mais neste QUIZ, vai concorrer a um notebook.
        </p>

        <p className="text-fg-subtle mt-4 text-copy-sm md:text-copy">Para participar e concorrer ao sorteio, é preciso atentar-se às regras a seguir:</p>

        <div id="draw-rules" className="mt-5 flex flex-col gap-4">
          {drawRules.map((rule) => (
            <Card key={rule.question}>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <ChevronRight className="size-5 shrink-0 mt-0.5 text-fg-brand" aria-hidden />
                  <h4 className="uppercase font-display text-label text-fg">{rule.question}</h4>
                </div>
                <p className="text-fg-subtle text-copy-sm md:text-copy pl-7">{rule.answer}</p>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardContent className="flex flex-col gap-2">
              <h4 className="uppercase font-display text-label text-fg">Resumo: O que eu preciso fazer para concorrer ao prêmio?</h4>

              <ul className="flex flex-col gap-2 text-fg-subtle mt-2 text-copy-sm md:text-copy">
                <li className="flex gap-2"><span className="text-fg-brand font-semibold">1)</span> <span>Responder ao <b className="text-fg font-semibold">QUIZ</b> até às 20h (horário de Brasília) de domingo.</span></li>
                <li className="flex gap-2"><span className="text-fg-brand font-semibold">2)</span> <span>Acertar 7 ou mais questões do <b className="text-fg font-semibold">QUIZ</b> (70% da prova);</span></li>
                <li className="flex gap-2"><span className="text-fg-brand font-semibold">3)</span> <span>Estao ao vivo nas 4 aulas, no meu canal no YouTube;</span></li>
              </ul>

              <p className="text-fg font-semibold mt-4 uppercase text-copy md:text-copy-lg">Boa sorte!</p>
            </CardContent>
          </Card>
        </div>

        <div id="draw-ordinance" className="mt-8">
          <h3 className="font-display text-h4 md:text-h3 text-fg uppercase">Regulamento do sorteio, apuração e recebimento do prêmio</h3>

          <div className="mt-4 w-full flex">
            <p className="text-fg-subtle text-copy-sm md:text-copy"><b className="text-fg-brand uppercase font-semibold">Método:</b> É compartilhado na tela a “lista” dos participantes elegíveis ao prêmio e o site para o sorteio (a lista corresponde a uma planilha consolidada em Excel; site: ferramenta de sorteio do Google). A lista divulgada conterá todos os nomes dos participantes regularmente habilitados, identificando cada um deles por meio de um número cardinal único que será utilizado no sorteio. O sorteio inicia-se com a escolha randômica, realizada pelo site, de um numeral cardinal. Em seguida verifique-se a correspondência do número sorteado com a numeração indicativa do participante. A correspondência entre os números indicará a identidade do participante sorteado. Ato contínuo, a equipe especialista do Devclub entrará em contato com o participante sorteado que deverá, obrigatoriamente, cumprir todos os requisitos exigidos. Caso não cumpra, o participante sorteado será desclassificado, sendo realizado um novo sorteio, repetindo-se todo o procedimento descrito acima.
            </p>
          </div>

          <div className="mt-4 w-full">
            <h3 className="font-display text-h5 md:text-h4 text-fg uppercase">Recebimento do Prêmio:</h3>
            <p className="text-fg-subtle text-copy-sm md:text-copy mt-2">A coleta do prêmio será realizada após a realização do sorteio, da seguinte forma:</p>

            <p className="text-fg-subtle mt-4 text-copy-sm md:text-copy">A equipe de especialista Devclub entrará em contato com o participante sorteado, através dos meios de contato cadastrados por ele no campo de dados pessoais deste QUIZ.</p>

            <p className="text-fg-subtle mt-4 text-copy-sm md:text-copy">O participante sorteado deverá obrigatoriamente residir e/ou indicar um endereço no Brasil para retirada do item previsto no kit em questão.</p>

            <p className="text-fg-subtle mt-4 text-copy-sm md:text-copy"><strong className="text-fg font-semibold">Importante:</strong> O participante sorteado deverá informar seus dados pessoais corretamente, assim como seu endereço e informações de sua empresa (se o caso), bem como um e-mail válido para, após o cadastro, ser liberado o seu acesso ao infoproduto Comunidade Devclub.
            </p>
          </div>
        </div>

        <div id="general-provisions" className="mt-8">
          <h3 className="font-display text-h4 md:text-h3 text-fg uppercase">Disposições gerais:</h3>

          <p className="text-fg-subtle text-copy-sm md:text-copy mt-4">
            A equipe do especialista Devclub reserva-se o direito de alterar todos os itens deste regulamento para o bom desenvolvimento da ação. Qualquer situação não prevista neste regulamento será resolvida exclusivamente pela equipe do especialista em até 48 horas a partir do ocorrido, a seu exclusivo critério.
          </p>

          <p className="text-fg-subtle text-copy-sm md:text-copy mt-6">
            Este sorteio tem caráter exclusivamente promocional e não implica qualquer modalidade de pagamento por parte dos participantes, não sendo, portanto, necessária a aquisição de nenhum produto, bem ou serviço.
          </p>

          <p className="text-fg-subtle text-copy-sm md:text-copy mt-6">É de responsabilidade exclusiva dos participantes responder, repassar, informar os seus dados pessoais para concorrer aos prêmios nos prazos previstos neste regulamento. A imprecisão das informações ordinárias para que os participantes possam concorrer regularmente aos prêmios implicará, a seleção da equipe do especialista Devclub, a desclassificação do participante.</p>

          <p className="text-fg-subtle text-copy-sm md:text-copy mt-6">
            Os participantes declaram expressamente ter lido e estar de acordo com o presente regulamento e suas condições.</p>

          <hr className="border-line mt-6" />
          <label className="flex items-center gap-3 mt-6 cursor-pointer">
            <Checkbox
              checked={isPolicyChecked}
              onCheckedChange={(checked) => setIsPolicyChecked(checked === true)}
            />
            <span className="text-fg-subtle text-copy-sm md:text-copy">
              Declaro ter lido e estar de acordo com o presente regulamento e suas condições.
            </span>
          </label>

          <div className="w-full mt-6 md:flex md:justify-center">
            <Button
              onClick={handleNavigate}
              size="lg"
              className="w-full md:w-1/2"
              type="button"
              disabled={!isPolicyChecked}
            >
              Prosseguir
            </Button>
          </div>
        </div>
      </section>

      {showScrollTopButton && (
        <Button
          onClick={scrollToTop}
          variant="secondary"
          size="icon"
          className="fixed bottom-6 right-6 rounded-full shadow-lg z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="size-5" aria-hidden />
        </Button>
      )}

      <Footer />
    </div>
  )
}

export default Home
