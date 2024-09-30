import { Header } from "../components/Header"
import { Footer } from "../components/Footer"

import mainBannerImg from '../assets/banner-min.png'

import { IoMdArrowDropright } from "react-icons/io"
import { useNavigate } from "react-router-dom"

import { useState } from "react"

function Home() {
  const [isChecked, setIsChecked] = useState(false)
  const navigate = useNavigate()

  const handleNavigate = (): void => {
    if (isChecked) {
      navigate('/preencher')
    } else {
      alert('Você precisa concordar com os termos para continuar.')
    }
  }

  return (
    <div className="w-full min-h-screen">
      <Header />

      <img src={mainBannerImg} alt="Banner oficial do evento" className="w-full object-cover mt-2" />

      <section className="w-full p-4 mt-2 flex-grow">
        <h3 className="text-blue-500 font-semibold text-lg">QUIZ do Desafio da Gestão de Tráfego</h3>

        <p className="text-zinc-600 mt-2">Seja muito bem-vindo(a) ao <b>QUIZ DO DESAFIO DA GESTÃO DE TRÁFEGO</b></p>

        <p className="text-zinc-600 mt-4 text-sm">A finalidade deste <b>QUIZ</b> é, primeiro, te ajudar a absorver todo o conteúdo que eu dei nas aulas do <b>DESAFIO DA GESTÃO DE TRÁFEGO</b>, colocando seu conhecimento, recém adquirido em prática, segundo, parabenizar e bonificar aqueles que comprovarem ter aprendido tudo que foi ensinado. Por isso, quem acertar 70% (setenta por cento) ou mais neste <b>QUIZ</b>, vai concorrer ao Kit Gestão de Tráfego e, caso sorteado, poderá escolher qual prefere: Kit Gestão de Tráfego N° 01 <b>OU</b> Kit Gestão de Tráfego N° 02</p>

        <ul className="text-zinc-600 mt-4 space-y-2 text-sm">
          <li><b>- Kit Gestão de Tráfego nº 01:</b> Computador + Iphone + Vaga na Comunidade Sobral de Tráfego</li>
          <li><b>- Kit Gestão de Tráfego nº 02:</b> 10 mil reais para você investir em anúncios online + Vaga na Comunidade Sobral de Tráfego;</li>
        </ul>

        <p className="text-zinc-600 mt-4 text-sm">Para participar e concorrer ao sorteio, é preciso atentar-se às regras a seguir:</p>

        <div id="draw-rules" className="mt-3 flex flex-col gap-5">
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center"><IoMdArrowDropright className="text-zinc-400" size={26} /> <h4 className="uppercase text-blue-500 font-semibold text-sm">Até quando eu posso fazer o quiz?</h4></div>
            <p className="text-zinc-600">Até às 18h (horário de Brasília) do dia 29/09/2024, domingo.</p>
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center"><IoMdArrowDropright className="text-zinc-400" size={26} /> <h4 className="uppercase text-blue-500 font-semibold text-sm">Quando acontecerá o sorteio?</h4></div>
            <p className="text-zinc-600">No domingo, dia 29/09/2024, durante a última aula do Desafio, que vai acontecer ao vivo no meu canal no YouTube e está prevista para começar às 20h (horário de Brasília).</p>
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center"><IoMdArrowDropright className="text-zinc-400" size={26} /> <h4 className="uppercase text-blue-500 font-semibold text-sm">Todo mundo que responder ao quiz participará do sorteio?</h4></div>
            <p className="text-zinc-600">NÃO. Apenas as pessoas que fizerem o QUIZ e acertarem 70% ou mais da prova serão elegíveis e participarão do sorteio.</p>
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center"><IoMdArrowDropright className="text-zinc-400" size={26} /> <h4 className="uppercase text-blue-500 font-semibold text-sm">Se eu for sorteado no domingo ao vivo terei direito, automaticamente, ao prêmio?</h4></div>
            <p className="text-zinc-600">NÃO. Como vai funcionar? É preciso que você cumpra todos os critérios: (1) esteja online e ao vivo no momento do sorteio, (2) você atenda a ligação falando a palavra-chave (que só será divulgada durante a aula do dia 29/09/2024).</p>
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center"><IoMdArrowDropright className="text-zinc-400" size={26} /> <h4 className="uppercase text-blue-500 font-semibold text-sm">Eu posso responder o quiz mais de uma vez para ter mais chances de ser sorteado?</h4></div>
            <p className="text-zinc-600">NÃO. A resposta está vinculada ao CPF e cada pessoa tem direito a apenas uma resposta. Isso garante a lisura do sorteio, excluindo a possibilidade de entrada dupla na lista e eliminando de fato as pessoas que, por não terem participado do DESAFIO DA GESTÃO DE TRÁFEGO, forem reprovadas.</p>
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center"><IoMdArrowDropright className="text-zinc-400" size={26} /> <h4 className="uppercase text-blue-500 font-semibold text-sm">Apenas uma pessoa vai receber todos os prêmios?</h4></div>
            <p className="text-zinc-600">Sim. Será realizado um único sorteio, por meio do qual será definido o participante que vai receber todos os prêmios (do Kit nº 01 OU do Kit nº 02) descritos neste regulamento.</p>
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <h4 className="uppercase text-blue-500 font-semibold text-sm">Resumo: O que eu preciso fazer para concorrer ao prêmio?</h4>

            <ul className="flex flex-col gap-2 text-zinc-600 mt-2">
              <li>1) Responder ao <b>QUIZ</b> até as 18h (horário de Brasília) do dia 29 de Setembro de 2024;</li>
              <li>2) Acertar 7 ou mais questões do <b>QUIZ</b> (70% da prova);</li>
              <li>3) Estar presente ATÉ O FINAL da live que vai acontecer no domingo, dia 29/09/2024, às 20h (horário de Brasília), no meu canal no YouTube;</li>
              <li>4) Saber a palavra-chave e atender ao telefone com o comando caso seja sorteado.</li>
            </ul>

            <p className="text-zinc-600 font-semibold mt-4 uppercase">Boa sorte!</p>
          </div>
        </div>

        <div id="draw-ordinance" className="mt-6">
          <h3 className="text-blue-500 font-semibold text-lg uppercase">Regulamento do sorteio, apuração e recebimento do prêmio</h3>

          <div className="mt-4 w-full flex">
            <p className="text-zinc-600 text-sm"><b className="text-blue-500 uppercase">Método:</b>É compartilhada na tela a “lista” dos participantes elegíveis ao prêmio e o site para o sorteio (a lista corresponde a uma planilha consolidada em Excel; site: ferramenta de sorteio do Google). A lista divulgada conterá todos os nomes dos participantes regularmente habilitados, identificando cada um deles por meio de um numeral cardinal único que será utilizado no sorteio. O sorteio inicia-se com a escolha randômica, realizada pelo site, de um numeral cardinal. Em seguida verifica-se a correspondência do número sorteado com a numeração indicativa do participante. A correspondência entre os números indicará a identidade do participante sorteado.  Ato contínuo, a equipe do especialista Pedro Sobral entrará em contato com o participante sorteado que deverá, obrigatoriamente, cumprir todos os requisitos exigidos. Caso não cumpra, o participante sorteado será desclassificado, sendo realizado um novo sorteio, repetindo-se todo o procedimento descrito acima.</p>
          </div>

          <div className="mt-4 w-full">
            <h3 className="text-blue-500 font-semibold text-lg uppercase">Recebimento do Prêmio:</h3>
            <p className="text-zinc-600 text-sm">O recebimento do prêmio será realizado após a realização do sorteio, da seguinte forma:</p>

            <p className="text-zinc-600 mt-4 text-sm">A equipe do especialista Devclub entrará em contato com o participante sorteado, através dos meios de contato cadastrados por ele no campo de dados pessoais deste QUIZ e solicitará que ele formalize qual dos kits é do seu interesse - Kit Gestão de Tráfego nº 01 OU Kit Gestão de Tráfego nº 02.</p>

            <p className="mt-4"><strong>Caso o participante sorteado opte por receber o Kit Gestão de Tráfego nº 01:</strong></p>

            <div className="flex items-center gap-2"><IoMdArrowDropright className="text-zinc-400" size={64} /><p className="text-zinc-600 text-sm">Em até 90 dias após a realização do sorteio, será enviado o notebook* e o Iphone* ao endereço do usuário. (*O modelo, marca e especificações dos itens serão escolhidos a partir de critérios definidos exclusivamente pela equipe do especialista Devclub).</p></div>

            <div className="flex items-center gap-2"><IoMdArrowDropright className="text-zinc-400" size={64} /><p className="text-zinc-600 text-sm">O participante sorteado obrigatoriamente deverá residir e/ou indicar um endereço no Brasil para recebimento dos itens previstos no kit em questão.</p></div>

            <div className="flex items-center gap-2"><IoMdArrowDropright className="text-zinc-400" size={64} /><p className="text-zinc-600 text-sm">Em até 07 dias após a realização do sorteio, será concedido 01 (um) acesso online ao infoproduto Comunidade Devclub de Tráfego pelo período de 12 (doze) meses.</p></div>

            <p className="mt-6"><strong>Caso o participante sorteado opte por receber o Kit Gestão de Tráfego nº 02:</strong></p>

            <div className="flex items-center gap-2"><IoMdArrowDropright className="text-zinc-400" size={64} /><p className="text-zinc-600 text-sm">Em até 30 dias após a realização do sorteio, o participante sorteado deverá encaminhar os Boletos Bancários e/ou Documentos de Cobrança, ainda não vencidos, no valor de R$10 mil e, ainda, deverá o participante sorteado apresentar para fins do pagamento do prêmio, a indicação do CNPJ do negócio detido em seu nome ou a comprovação da condução do negócio por si, se na pessoa física.</p></div>

            <div className="flex items-center gap-2"><IoMdArrowDropright className="text-zinc-400" size={64} /> <p className="text-zinc-600 text-sm">Em até 07 dias após a realização do sorteio, será concedido 01 (um) acesso online ao infoproduto Comunidade Devclub de Tráfego pelo período de 12 (doze) meses.</p></div>

            <p className="text-zinc-600 text-sm mt-4"><strong>Importante:</strong>{" "}O participante sorteado deverá informar seus dados pessoais corretamente, assim como seu endereço e informações da sua empresa (se o caso), bem como um e-mail válido para, após o cadastro, ser liberado o seu acesso ao infoproduto Comunidade Sobral de Tráfego.</p>
          </div>
        </div>

        <div id="general-provisions" className="mt-6">
          <h3 className="text-blue-500 font-semibold text-lg uppercase">Disposições gerais:</h3>

          <p className="text-zinc-600 text-sm">
            A equipe do especialista Devclub reserva-se o direito de alterar quaisquer itens deste regulamento visando o bom desenvolvimento da ação. Qualquer situação não prevista neste regulamento será resolvida exclusivamente pela equipe do especialista em até 48 horas a partir do ocorrido, a seu exclusivo critério.
          </p>

          <p className="text-zinc-600 text-sm mt-6">
            Este sorteio tem caráter exclusivamente promocional e não implica qualquer modalidade de pagamento por parte dos participantes, não sendo, portanto, necessária a aquisição de nenhum produto, bem ou serviço.
          </p>

          <p className="text-zinc-600 text-sm mt-6">É de exclusiva responsabilidade dos participantes responder, repassar, informar os seus dados pessoais para concorrer aos prêmios nos prazos previstos neste regulamento. A imprecisão das informações exigidas para que os participantes possam concorrer regularmente aos prêmios implicará, a critério da equipe do especialista Pedro Sobral, a desclassificação do participante.</p>

          <p className="text-zinc-600 text-sm mt-6">
            Os participantes declaram expressamente ter lido e estarem de acordo com o presente regulamento e suas condições.</p>

          <hr className="opacity-60 mt-4" />
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            <p className="text-zinc-600 text-sm">
              Declaro ter lido e estar de acordo com o presente regulamento e suas condições.
            </p>
          </div>

          <button
            onClick={handleNavigate}
            className={`text-white bg-blue-500 h-12 rounded-sm shadow-sm w-full mt-4 ${!isChecked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            type="button"
            disabled={!isChecked}
          >
            Prosseguir
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
