import { useEffect, useState } from "react"

import { Header } from "../components/Header"
import { Footer } from "../components/Footer"

import mainBannerImg from '../assets/banner-min.png'

import { useNavigate } from "react-router-dom"
import { IoMdArrowDropup } from "react-icons/io"
import { IoMdArrowDropright } from "react-icons/io"

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

  console.log(isPolicyChecked)

  return (
    <div className="w-full min-h-screen">
      <Header />

      <div className="w-full min-lg:max-w-[1063px] min-lg:mx-auto">
        <img src={mainBannerImg} alt="Banner oficial do evento" className="w-full object-cover mt-2 max-h-[270px]" />
      </div>

      <section className="w-full p-4 mt-2 flex-grow min-lg:max-w-[1063px] min-lg:mx-auto">
        <h3 className="text-violet-500 font-semibold text-lg min-md:text-2xl">Quiz do Missão Programação do Zero</h3>

        <p className="text-zinc-600 mt-2 text-sm min-md:text-lg">Seja muito bem-vindo ao <b>QUIZ do MISSÃO PROGRAMAÇÃO DO ZERO.</b></p>

        <p className="text-zinc-600 mt-4 text-sm min-md:text-base">A finalidade deste QUIZ é, primeiro, ajudar a absorver todo o conteúdo que eu dei nas aulas do Missão Programação do Zero, colocando seu conhecimento, recém adquirido na prática, segundo, parabenizar e bonificar aqueles que comprovarem ter aprendido tudo o que foi ensinado. Por isso, quem acertar 70% (setenta por cento) ou mais neste QUIZ, vai concorrer a um notebook.
        </p>

        <p className="text-zinc-600 mt-4 text-sm min-md:text-base">Para participar e concorrer ao sorteio, é preciso atentar-se às regras a seguir:</p>

        <div id="draw-rules" className="mt-3 flex flex-col gap-5">
          <div className="flex flex-col gap-1 text-sm min-md:text-base">
            <div className="flex items-center"><IoMdArrowDropright className="text-zinc-400" size={26} style={{ minWidth: '26px', marginRight: '8px' }} /> <h4 className="uppercase text-violet-500 font-semibold text-sm">Até quando eu posso fazer o quiz?</h4></div>
            <p className="text-zinc-600">Até às 18h (horário de Brasília) da segunda-feira.</p>
          </div>

          <div className="flex flex-col gap-1 text-sm min-md:text-base">
            <div className="flex items-center"><IoMdArrowDropright className="text-zinc-400" size={26} style={{ minWidth: '26px', marginRight: '8px' }} /> <h4 className="uppercase text-violet-500 font-semibold text-sm">Todo mundo que respondeu ao quiz participará do sorteio?</h4></div>
            <p className="text-zinc-600">NÃO. Apenas as pessoas que fizerem o QUIZ e acertarem 70% ou mais da prova serão elegíveis e participarão do sorteio.</p>
          </div>

          <div className="flex flex-col gap-1 text-sm min-md:text-base">
            <div className="flex items-center"><IoMdArrowDropright className="text-zinc-400" size={26} style={{ minWidth: '26px', marginRight: '8px' }} /> <h4 className="uppercase text-violet-500 font-semibold text-sm">Basta ser sorteado e o notebook será meu?</h4></div>
            <p className="text-zinc-600">NÃO. Como vai funcionar? É preciso que você cumpra todos os critérios: (1) esteja ao vivo comigo em todas as aulas, (2) responda corretamente pelo menos 70% do quiz.</p>
          </div>

          <div className="flex flex-col gap-1 text-sm min-md:text-base">
            <div className="flex items-center"><IoMdArrowDropright className="text-zinc-400" size={26} style={{ minWidth: '26px', marginRight: '8px' }} /> <h4 className="uppercase text-violet-500 font-semibold text-sm">Eu posso responder o quiz mais de uma vez para ter mais chances de ser sorteado?</h4></div>
            <p className="text-zinc-600">NÃO. A resposta está vinculada ao CPF e cada pessoa tem direito a apenas uma resposta. Isso garante a lisura do sorteio, excluindo a possibilidade de entrada dupla na lista e eliminando de fato as pessoas que, por não terem participado do Missão Programação do Zero, sejam reprovadas.</p>
          </div>

          <div className="flex flex-col gap-1 text-sm min-md:text-base">
            <div className="flex items-center"><IoMdArrowDropright className="text-zinc-400" size={26} style={{ minWidth: '26px', marginRight: '8px' }} /> <h4 className="uppercase text-violet-500 font-semibold text-sm">Apenas uma pessoa vai receber todos os prêmios?</h4></div>
            <p className="text-zinc-600">Sim. Será realizado um único sorteio, de apenas um notebook.</p>
          </div>

          <div className="flex flex-col gap-1 text-sm min-md:text-base">
            <h4 className="uppercase text-violet-500 font-semibold text-sm">Resumo: O que eu preciso fazer para concorrer ao prêmio?</h4>

            <ul className="flex flex-col gap-2 text-zinc-600 mt-2">
              <li>1) Responder ao <b>QUIZ</b> até às 18h (horário de Brasília) da Segunda-feira.</li>
              <li>2) Acertar 7 ou mais questões do <b>QUIZ</b> (70% da prova);</li>
              <li>3)Estao ao vivo nas 4 aulas, no meu canal no YouTube;
              </li>
            </ul>

            <p className="text-zinc-600 font-semibold mt-4 uppercase min-md:text-lg">Boa sorte!</p>
          </div>
        </div>

        <div id="draw-ordinance" className="mt-6">
          <h3 className="text-violet-500 font-semibold text-lg uppercase">Regulamento do sorteio, apuração e recebimento do prêmio</h3>

          <div className="mt-4 w-full flex">
            <p className="text-zinc-600 text-sm min-md:text-base"><b className="text-violet-500 uppercase">Método:</b> É compartilhado na tela a “lista” dos participantes elegíveis ao prêmio e o site para o sorteio (a lista corresponde a uma planilha consolidada em Excel; site: ferramenta de sorteio do Google). A lista divulgada conterá todos os nomes dos participantes regularmente habilitados, identificando cada um deles por meio de um número cardinal único que será utilizado no sorteio. O sorteio inicia-se com a escolha randômica, realizada pelo site, de um numeral cardinal. Em seguida verifique-se a correspondência do número sorteado com a numeração indicativa do participante. A correspondência entre os números indicará a identidade do participante sorteado. Ato contínuo, a equipe especialista do Devclub entrará em contato com o participante sorteado que deverá, obrigatoriamente, cumprir todos os requisitos exigidos. Caso não cumpra, o participante sorteado será desclassificado, sendo realizado um novo sorteio, repetindo-se todo o procedimento descrito acima.
            </p>
          </div>

          <div className="mt-4 w-full">
            <h3 className="text-violet-500 font-semibold text-lg uppercase">Recebimento do Prêmio:</h3>
            <p className="text-zinc-600 text-sm min-md:text-base">A coleta do prêmio será realizada após a realização do sorteio, da seguinte forma:</p>

            <p className="text-zinc-600 mt-4 text-sm min-md:text-base">A equipe de especialista Devclub entrará em contato com o participante sorteado, através dos meios de contato cadastrados por ele no campo de dados pessoais deste QUIZ.</p>

            <p className="text-zinc-600 mt-4 text-sm min-md:text-base">O participante sorteado deverá obrigatoriamente residir e/ou indicar um endereço no Brasil para retirada do item previsto no kit em questão.</p>

            <p className="text-zinc-600 mt-4 text-sm min-md:text-base"><strong>Importante:</strong> O participante sorteado deverá informar seus dados pessoais corretamente, assim como seu endereço e informações de sua empresa (se o caso), bem como um e-mail válido para, após o cadastro, ser liberado o seu acesso ao infoproduto Comunidade Devclub.
            </p>
          </div>
        </div>

        <div id="general-provisions" className="mt-6">
          <h3 className="text-violet-500 font-semibold text-lg uppercase">Disposições gerais:</h3>

          <p className="text-zinc-600 text-sm min-md:text-base mt-4">
            A equipe do especialista Devclub reserva-se o direito de alterar todos os itens deste regulamento para o bom desenvolvimento da ação. Qualquer situação não prevista neste regulamento será resolvida exclusivamente pela equipe do especialista em até 48 horas a partir do ocorrido, a seu exclusivo critério.
          </p>

          <p className="text-zinc-600 text-sm min-md:text-base mt-6">
            Este sorteio tem caráter exclusivamente promocional e não implica qualquer modalidade de pagamento por parte dos participantes, não sendo, portanto, necessária a aquisição de nenhum produto, bem ou serviço.
          </p>

          <p className="text-zinc-600 text-sm min-md:text-base mt-6">É de responsabilidade exclusiva dos participantes responder, repassar, informar os seus dados pessoais para concorrer aos prêmios nos prazos previstos neste regulamento. A imprecisão das informações ordinárias para que os participantes possam concorrer regularmente aos prêmios implicará, a seleção da equipe do especialista Devclub, a desclassificação do participante.</p>

          <p className="text-zinc-600 text-sm min-md:text-base mt-6">
            Os participantes declaram expressamente ter lido e estar de acordo com o presente regulamento e suas condições.</p>

          <hr className="opacity-60 mt-4" />
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              checked={isPolicyChecked}
              onChange={(e) => setIsPolicyChecked(e.target.checked)}
            />
            <p className="text-zinc-600 text-sm min-md:text-base">
              Declaro ter lido e estar de acordo com o presente regulamento e suas condições.
            </p>
          </div>

          <div className="w-full min-md:flex min-md:justify-center">
            <button
              onClick={handleNavigate}
              className={`text-white bg-violet-500 h-12 rounded-sm shadow-sm w-full min-md:w-[50%] mt-4 ${!isPolicyChecked ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 hover:transition-all'
                }`}
              type="button"
              disabled={!isPolicyChecked}
            >
              Prosseguir
            </button>
          </div>
        </div>
      </section>

      {showScrollTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-violet-500 text-white p-3 rounded-full shadow-lg hover:bg-violet-700 transition duration-300 z-50"
          aria-label="Scroll to top"
        >
          <IoMdArrowDropup size={24} />
        </button>
      )}

      <Footer />
    </div>
  )
}

export default Home
