import { PrivateHeader } from "../../../components/PrivateHeader"

import mainBannerImg from "../../../assets/banner-min.png"

import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"

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
  const navigate = useNavigate()

  const quiz: Question[] = [
    {
      id: '1',
      question: 'Antes de anunciar, é necessário aprimorar o seu Instagram para receber uma nova audiência. Para isso, você precisa se atentar a alguns fatores:',
      answers: [
        {
          id: '1',
          description: 'O fator mais importante é quantas publicações você tem.',
          isAnswerCorrect: false,
        },
        {
          id: '2',
          description: 'Número de collabs, engajamento e selo verificado.',
          isAnswerCorrect: false,
        },
        {
          id: '3',
          description: 'Fotos de perfil, nome do perfil, título, bio, links e destaques.',
          isAnswerCorrect: false,
        },
        {
          id: '4',
          description: 'Se o número de anúncios ativos é superior a 20.',
          isAnswerCorrect: true,
        },
      ],
      rightAnswer: {
        id: 'id-da-resporta-certa',
        answer: 'Se o número de anúncios ativos é superior a 20.',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      question: 'Para faturar de 5 a 10 mil por mês como gestor de tráfego você precisa de um(P+L+A+N+O)*F. Esta sigla se refera a:',
      answers: [
        {
          id: '1',
          description: '(Planejamento, Lealdade, Atenção, Novidades, Objetivo) * Fidelidade.',
          isAnswerCorrect: false,
        },
        {
          id: '2',
          description: '(Planos, Leads, Anúncios, Novidades, Objeção) * Fama.',
          isAnswerCorrect: false,
        },
        {
          id: '3',
          description: '(Praticidade, Leads, Amizade, Níveis de consciência, Objeção) * Familiaridade.',
          isAnswerCorrect: false,
        },
        {
          id: '4',
          description: '(Posicionamento, Lugar, Abordagens, Nicho, O que você sabe) * Fechamento.',
          isAnswerCorrect: true,
        },
      ],
      rightAnswer: {
        id: 'id-da-resporta-certa',
        answer: '(Posicionamento, Lugar, Abordagens, Nicho, O que você sabe) * Fechamento.',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      question: 'Antes de escolher os termos de pesquisa para os quais o seu anúncio vai aparecer no Google, você deve:',
      answers: [
        {
          id: '1',
          description: 'Fazer um levantamento das palavras-chave que você vai utilizar na sua campanha.',
          isAnswerCorrect: true,
        },
        {
          id: '2',
          description: 'Verificar se o Meta Ads permite que você faça o anúncio.',
          isAnswerCorrect: false,
        },
        {
          id: '3',
          description: 'Investir em panfletos primeiro e, só depois, partir para o Google.',
          isAnswerCorrect: false,
        },
        {
          id: '4',
          description: 'Escrever apenas o nome do seu concorrente nos termos de pesquisa.',
          isAnswerCorrect: false,
        },
      ],
      rightAnswer: {
        id: 'id-da-resporta-certa',
        answer: 'Fazer um levantamento das palavras-chave que você vai utilizar na sua campanha.',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      question: 'A publicidade 2.0 é mais vantajoso porque:',
      answers: [
        {
          id: '1',
          description: 'Poder anunciar no outdoor do meu bairro e distribuir 1000 panfletos por dia por um preço justo.',
          isAnswerCorrect: false,
        },
        {
          id: '2',
          description: 'Você tem mais controle sobre os gastos dos anúncios, é possível criar anúncios com objetivos específicos, como também mensurar os resultados.',
          isAnswerCorrect: true,
        },
        {
          id: '3',
          description: 'Controle para gastar o quanto você quiser com anúncios em horário nobre na TV, impacto mensurável e o superpoder da otimização constante.',
          isAnswerCorrect: false,
        },
        {
          id: '4',
          description: 'Através dela você pode fazer um esquema de pirâmide no mercado e não ser responsabilizado por isso.',
          isAnswerCorrect: false,
        },
      ],
      rightAnswer: {
        id: 'id-da-resporta-certa',
        answer: 'Você tem mais controle sobre os gastos dos anúncios, é possível criar anúncios com objetivos específicos, como também mensurar os resultados.',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5',
      question: 'Toda vez que uma pessoa está online, acontece um leilão para ver qual anunciante vai ter seu anúncio mostrado. Quais são os quesitos avaliados no leilão dos anúncios online?',
      answers: [
        {
          id: '1',
          description: 'Orçamento, Objetivo, Público, Anúncio (OOPA)',
          isAnswerCorrect: true,
        },
        {
          id: '2',
          description: 'Objeção, Otimização, Orgulho, Anúncio (OOOA)',
          isAnswerCorrect: false,
        },
        {
          id: '3',
          description: 'Orçamento, Objeção, Publicidade, Estudo (OOPE).',
          isAnswerCorrect: false,
        },
        {
          id: '4',
          description: 'Objeção, Originalidade, Página, Análise (OOPA)',
          isAnswerCorrect: false,
        },
      ],
      rightAnswer: {
        id: 'id-da-resporta-certa',
        answer: 'Orçamento, Objetivo, Público, Anúncio (OOPA)',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '6',
      question: 'As principais diferenças entre o Google Ads e o Meta Ads são:',
      answers: [
        {
          id: '1',
          description: 'O Google Ads é uma ferramenta do Estado e, por isso, controlado por ele. Já o Meta Ads é uma ferramenta democrática.',
          isAnswerCorrect: false,
        },
        {
          id: '2',
          description: 'O Google Ads é uma ferramenta de intenção e relação, enquanto o Meta Ads é uma ferramenta de atenção e relação.',
          isAnswerCorrect: true,
        },
        {
          id: '3',
          description: 'Não existe nenhuma diferença entre essas ferramentas porque elas existem para tirar mais dinheiro das empresas.',
          isAnswerCorrect: false,
        },
        {
          id: '4',
          description: 'O Google Ads é para empresas e o Meta Ads para influencers.',
          isAnswerCorrect: false,
        },
      ],
      rightAnswer: {
        id: 'id-da-resporta-certa',
        answer: 'O Google Ads é uma ferramenta de intenção e relação, enquanto o Meta Ads é uma ferramenta de atenção e relação.',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '7',
      question: 'O sucesso das campanhas da rede de pesquisa do Google Ads dependem de 3 fatores:',
      answers: [
        {
          id: '1',
          description: 'Palavras informais, uma boa imagem, um bom equipamento de vídeo.',
          isAnswerCorrect: false,
        },
        {
          id: '2',
          description: 'Palavras-chave, anúncio, site.',
          isAnswerCorrect: true,
        },
        {
          id: '3',
          description: 'Anúncio, uma boa imagem e uma reunião presencial com o Google.',
          isAnswerCorrect: false,
        },
        {
          id: '4',
          description: 'Palavras-chave, marketing 1.0 e panfletos no negócio local.',
          isAnswerCorrect: false,
        },
      ],
      rightAnswer: {
        id: 'id-da-resporta-certa',
        answer: 'Palavras-chave, anúncio, site.',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '8',
      question: 'O que são públicos quentes?',
      answers: [
        {
          id: '1',
          description: 'Pessoas que nunca tiveram contato com você.',
          isAnswerCorrect: true,
        },
        {
          id: '2',
          description: 'Pessoas que moram no norte do estado.',
          isAnswerCorrect: false,
        },
        {
          id: '3',
          description: 'Pessoas fora do seu público alvo.',
          isAnswerCorrect: false,
        },
        {
          id: '4',
          description: 'Pessoas que você têm contato constante ou recente com você.',
          isAnswerCorrect: false,
        },
      ],
      rightAnswer: {
        id: 'id-da-resporta-certa',
        answer: 'Pessoas que nunca tiveram contato com você.',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '9',
      question: 'Na aula, foram indicadas algumas maneiras para abordar perfis de possíveis clientes. Qual maneira NÃO é indicada nos dias atuais?',
      answers: [
        {
          id: '1',
          description: 'Presencialmente.',
          isAnswerCorrect: false,
        },
        {
          id: '2',
          description: 'E-mail.',
          isAnswerCorrect: false,
        },
        {
          id: '3',
          description: 'Redes Sociais.',
          isAnswerCorrect: false,
        },
        {
          id: '4',
          description: 'Tráfego pago.',
          isAnswerCorrect: false,
        },
        {
          id: '5',
          description: 'Carta.',
          isAnswerCorrect: true,
        },
      ],
      rightAnswer: {
        id: 'id-da-resporta-certa',
        answer: 'Carta.',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '10',
      question: 'Existem 3 elementos essenciais para criar um bom anúncio. Quais são esses 3 elementos?',
      answers: [
        {
          id: '1',
          description: 'Boas referências, formato adaptado para a mídia e uma estrutura (gancho, corpo e CTA).',
          isAnswerCorrect: true,
        },
        {
          id: '2',
          description: 'Um influenciador bombástico para uma collab, uma grande verba e um bom gestor de tráfego.',
          isAnswerCorrect: false,
        },
        {
          id: '3',
          description: 'Um bom produto, uma boa verba e uma boa audiência.',
          isAnswerCorrect: false,
        },
        {
          id: '4',
          description: 'Boas referências, uma boa verba e o leilão.',
          isAnswerCorrect: false,
        },
      ],
      rightAnswer: {
        id: 'id-da-resporta-certa',
        answer: 'Boas referências, formato adaptado para a mídia e uma estrutura (gancho, corpo e CTA).',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId,
    }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Respostas enviadas:', selectedAnswers)
  }

  const handleNavigate = (): void => {
    navigate('/resultado')
  }

  return (
    <div className="w-full h-screen">
      <PrivateHeader />
      <div className="w-full h-full bg-gray-100 p-4">

        <img src={mainBannerImg} alt="Banner oficial do evento" className="w-full object-cover mt-2 mb-4" />

        <form onSubmit={handleSubmit} className="space-y-8 pb-4">
          {quiz.map((question) => (
            <div key={question.id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-base font-bold mb-4">{question.question}</h2>
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
                    />
                    <span className="text-gray-700">{answer.description}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* mudar p/ type submit */}
          <button
            type="button"
            onClick={handleNavigate}
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg shadow hover:bg-green-700 transition duration-300 mt-8"
          >
            Enviar respostas
          </button>
        </form>
      </div>
    </div>
  )
}