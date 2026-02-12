import { useEffect, useState } from "react"

import { User, useUser } from "../../../hooks/user"
import { ToastifyDisplay } from "../../../utils"
import { quizAdminAPI } from "../../../services/api"

import { Modal } from "../../../components/Modal"
import { AdminPrivateHeader } from "../../../components/AdminPrivateHeader"

import { FaRegCopy } from "react-icons/fa"
import { BsFiletypeXlsx } from "react-icons/bs"
import { VscErrorSmall } from "react-icons/vsc"
import { BiTrashAlt } from "react-icons/bi";
import { RiSendPlane2Line } from "react-icons/ri"
import { ImSpinner3, ImCheckboxChecked } from "react-icons/im"

import * as XLSX from 'xlsx'

type MenuOptions = 'dashboard' | 'Q&A'

export function AdminDashboard() {
  const { adminData } = useUser()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchUser, setSearchUser] = useState<string>('')

  const [loadingFilter, setLoadingFilter] = useState<boolean>(false)

  const [menuOptions, setMenuOptions] = useState<MenuOptions>('dashboard')

  const [selectedUser, setSelectedUser] = useState<User>({})
  const [showModal, setShowModal] = useState<string>('#0')
  const [copied, setCopied] = useState<boolean>(false)
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false)

  const handleQueryUsers = async (): Promise<void> => {
    try {
      const response = await quizAdminAPI('/admin/list-users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 200) {
        setUsers(response.data)
        setFilteredUsers(response.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const exportToXLSX = (): void => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredUsers.map((user, index) => ({
        "#": index + 1,
        "Nome Completo": user.name,
        "CPF": user.document,
        "Telefone": user.phone,
        "Nota": user.finalGrade !== null ? user.finalGrade : 'Não preenchido',
        "Palavras-chave": user?.keywords!.length > 0 ? user?.keywords!.join(', ') : 'Nenhuma',
      }))
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuários")
    XLSX.writeFile(workbook, "usuarios_quiz.xlsx")

    ToastifyDisplay({ toastType: 'success', message: 'Exportação realizada com sucesso.' })()
  }

  const handleSearch = (): void => {
    setLoadingFilter(true)

    setTimeout(() => {
      if (searchUser.trim() === '') {
        setFilteredUsers(users)
        setLoadingFilter(false)
      } else {
        const filtered = users.filter(user =>
          user.name!.toLowerCase().includes(searchUser.toLowerCase())
        )
        setFilteredUsers(filtered)
        setLoadingFilter(false)
      }
    }, 1000)
  }

  const handleChangeMenuType = (menuType: MenuOptions): void => {
    if (menuType === 'dashboard') {
      setMenuOptions('dashboard')
    } else if (menuType === 'Q&A') {
      setMenuOptions('Q&A')
    }
  }

  const handleModal = (user: User): void => {
    setSelectedUser(user)
    setShowModal('#modal-details')
  }

  const handleCloseModal = (): void => {
    setShowModal('#0')
  }

  const handleKeywordsModal = (user: User): void => {
    setSelectedUser(user)
    setShowModal('#modal-keywords')
  }

  const handleCopyPhone = (): void => {
    navigator.clipboard.writeText(selectedUser?.phone!)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const handleDeleteUsers = (): void => {
    if (!users.length || !filteredUsers.length) {
      return
    }
    setShowModal('#modal-delete')
  }

  const confirmDeleteUsers = async (): Promise<void> => {
    setLoadingDelete(true)
    try {
      const response = await quizAdminAPI('/admin/delete-users', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminData?.token}`,
        },
      });

      if (response.status === 200) {
        handleQueryUsers()
        handleCloseModal()
        ToastifyDisplay({
          toastType: 'success',
          message: 'Usuário(s) excluído(s) com sucesso',
        })();
      }
    } catch (error) {
      ToastifyDisplay({
        toastType: 'error',
        message: 'Erro ao excluir o(s) usuário(s). Tente novamente mais tarde.',
      });
    } finally {
      setLoadingDelete(false)
    }
  }

  useEffect(() => {
    handleQueryUsers()
  }, [])

  console.log(showModal)

  return (
    <>
      <div className="w-full min-h-screen">
        <AdminPrivateHeader />
        <div className="w-full p-4 flex-grow min-lg:max-w-[940px] min-lg:mx-auto mt-5">
          <div className="flex items-center justify-between">

            <ul className="flex items-center gap-4 overflow-x-auto px-1">
              <li onClick={() => handleChangeMenuType('dashboard')} className={`font-semibold text-zinc-600 hover:opacity-80 hover:transition-all cursor-pointer px-1 ${menuOptions === 'dashboard' && 'bg-violet-200 rounded-md'}`}>Dashboard</li>
              <li onClick={() => handleChangeMenuType('Q&A')} className={`font-semibold text-zinc-600 hover:opacity-80 hover:transition-all cursor-pointer px-1 ${menuOptions === 'Q&A' && 'bg-violet-200 rounded-md'}`}>Q&A</li>
            </ul>
            <div className="flex items-center gap-2">
              <BiTrashAlt onClick={handleDeleteUsers} size={22} className="text-zinc-600 cursor-pointer hover:opacity-80 transition-all" title="Excluir todos os usuários" />
              <BsFiletypeXlsx size={20} className="text-zinc-600 cursor-pointer hover:opacity-80 transition-all" title="Exportar tabela de usuários" onClick={exportToXLSX} />
            </div>
          </div>
          <hr />

          {menuOptions === 'dashboard' && (
            <>
              <div className="mt-4 flex flex-col gap-4">
                <p className="text-zinc-600 text-sm min-lg:text-base">
                  Qtd. Total: <strong>({filteredUsers?.length})</strong>
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={searchUser}
                    onChange={e => setSearchUser(e.target.value)}
                    placeholder="Pesquisar por nome de usuário..."
                    className="text-xs border bg-slate-100 p-1 w-80 outline-none pl-2 pr-4 h-8"
                    maxLength={128}
                    autoComplete="true"
                  />

                  {loadingFilter ?
                    <ImSpinner3 size={18} className="text-zinc-600 animate-spin" />
                    :
                    <button id="search-user-button" type="button" onClick={handleSearch}>
                      <RiSendPlane2Line
                        size={20}
                        className="text-zinc-600 cursor-pointer hover:opacity-80 transition-all"
                        title="Pesquisar"
                      />
                    </button>
                  }
                </div>
              </div>

              <div className="w-full overflow-x-auto mt-4">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border border-gray-200 text-left text-sm min-lg:text-base text-zinc-700">#</th>
                      <th className="py-2 px-4 border border-gray-200 text-left text-sm min-lg:text-base text-zinc-700">Nome</th>
                      <th className="py-2 px-4 border border-gray-200 text-left text-sm min-lg:text-base text-zinc-700">CPF</th>
                      <th className="py-2 px-4 border border-gray-200 text-left text-sm min-lg:text-base text-zinc-700">Telefone</th>
                      <th className="py-2 px-4 border border-gray-200 text-left text-sm min-lg:text-base text-zinc-700">Nota QUIZ</th>
                      <th className="py-2 px-4 border border-gray-200 text-left text-sm min-lg:text-base text-zinc-700">Palavras-chave</th>
                      <th className="py-2 px-4 border border-gray-200 text-left text-sm min-lg:text-base text-zinc-700">Detalhes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr key={user.id} className="hover:opacity-60 hover:transition-all">
                        <td className="py-2 px-4 border border-gray-200 text-sm min-lg:text-base ">{index + 1}</td>
                        <td className="py-2 px-4 border border-gray-200 text-sm min-lg:text-base max-w-[280px] truncate">{user.name}</td>
                        <td className="py-2 px-4 border border-gray-200 text-sm min-lg:text-base">{user.document!.slice(0, 3)}***</td>
                        <td className="py-2 px-4 border border-gray-200 text-sm min-lg:text-base">{user.phone!.slice(0, 7)}****</td>
                        <td className="py-2 px-4 border border-gray-200 text-xs min-lg:text-sm">{user.finalGrade !== -1 ? user.finalGrade : 'Não preenchido'}</td>
                        <td className="py-2 px-4 border border-gray-200 text-xs min-lg:text-sm cursor-pointer text-center" onClick={() => handleKeywordsModal(user)}>Ver</td>
                        <td className="py-2 px-4 border border-gray-200 text-xs min-lg:text-sm cursor-pointer text-center" onClick={() => handleModal(user)}>Ver</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {menuOptions === 'Q&A' && (
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-zinc-600 font-semibold">Adicionar Perguntas</h3>
                <p className="text-xs font-semibold text-zinc-600">Marque se a alternativa é <b>verdadeira</b> ou <b>falsa</b> pelos ícones ao lado do texto</p>
              </div>
              <form onSubmit={() => { }} className="flex flex-col gap-4">
                <label htmlFor="" className="flex flex-col gap-1">
                  <p className="text-zinc-600 font-semibold">Questão</p>
                  <input
                    id="question-input"
                    type="text"
                    className="h-12 w-full text-sm rounded-sm bg-transparent pl-2 pr-4 font-semibold outline-none border focus:border-violet-500 focus:ring focus:ring-violet-300 focus:ring-opacity-50 transition duration-200"
                    placeholder="digite a pergunta aqui"
                    required
                  />
                </label>

                <label htmlFor="" className="flex flex-col">
                  <div className="flex items-center justify-between max-w-[180px]">
                    <p className="text-zinc-600 font-semibold">Alternativa #1</p>
                    <div id="alternative-1" className="flex items-center gap-1">
                      <ImCheckboxChecked size={15} id="correct" className="text-zinc-400 cursor-pointer hover:opacity-80 hover:transition-all" />
                      <VscErrorSmall id="wrong" size={32} className="text-zinc-400 cursor-pointer hover:opacity-80 hover:transition-all" />
                    </div>
                  </div>
                  <input
                    id="choise-input-1"
                    type="text"
                    className="h-12 w-full text-sm rounded-sm bg-transparent pl-2 pr-4 font-semibold outline-none border focus:border-violet-500 focus:ring focus:ring-violet-300 focus:ring-opacity-50 transition duration-200"
                    placeholder="digite uma alternativa aqui"
                    required
                  />
                </label>

                <label htmlFor="" className="flex flex-col">
                  <div className="flex items-center justify-between max-w-[180px]">
                    <p className="text-zinc-600 font-semibold">Alternativa #2</p>
                    <div id="alternative-2" className="flex items-center gap-1">
                      <ImCheckboxChecked size={15} id="correct" className="text-zinc-400 cursor-pointer hover:opacity-80 hover:transition-all" />
                      <VscErrorSmall id="wrong" size={32} className="text-zinc-400 cursor-pointer hover:opacity-80 hover:transition-all" />
                    </div>
                  </div>
                  <input
                    id="choise-input-2"
                    type="text"
                    className="h-12 w-full text-sm rounded-sm bg-transparent pl-2 pr-4 font-semibold outline-none border focus:border-violet-500 focus:ring focus:ring-violet-300 focus:ring-opacity-50 transition duration-200"
                    placeholder="digite uma alternativa aqui"
                    required
                  />
                </label>

                <label htmlFor="" className="flex flex-col">
                  <div className="flex items-center justify-between max-w-[180px]">
                    <p className="text-zinc-600 font-semibold">Alternativa #3</p>
                    <div id="alternative-3" className="flex items-center gap-1">
                      <ImCheckboxChecked size={15} id="correct" className="text-zinc-400 cursor-pointer hover:opacity-80 hover:transition-all" />
                      <VscErrorSmall id="wrong" size={32} className="text-zinc-400 cursor-pointer hover:opacity-80 hover:transition-all" />
                    </div>
                  </div>
                  <input
                    id="choise-input-3"
                    type="text"
                    className="h-12 w-full text-sm rounded-sm bg-transparent pl-2 pr-4 font-semibold outline-none border focus:border-violet-500 focus:ring focus:ring-violet-300 focus:ring-opacity-50 transition duration-200"
                    placeholder="digite uma alternativa aqui"
                    required
                  />
                </label>

                <label htmlFor="" className="flex flex-col">
                  <div className="flex items-center justify-between max-w-[180px]">
                    <p className="text-zinc-600 font-semibold">Alternativa #4</p>
                    <div id="alternative-4" className="flex items-center gap-1">
                      <ImCheckboxChecked size={15} id="correct" className="text-zinc-400 cursor-pointer hover:opacity-80 hover:transition-all" />
                      <VscErrorSmall id="wrong" size={32} className="text-zinc-400 cursor-pointer hover:opacity-80 hover:transition-all" />
                    </div>
                  </div>
                  <input
                    id="choise-input-4"
                    type="text"
                    className="h-12 w-full text-sm rounded-sm bg-transparent pl-2 pr-4 font-semibold outline-none border focus:border-violet-500 focus:ring focus:ring-violet-300 focus:ring-opacity-50 transition duration-200"
                    placeholder="digite uma alternativa aqui"
                    required
                  />
                </label>

                <label htmlFor="" className="flex flex-col gap-1">
                  <div className="flex items-center justify-between max-w-[265px]">
                    <p className="text-zinc-600 font-semibold">Alternativa #5 (opcional)</p>
                    <div id="alternative-5" className="flex items-center gap-1">
                      <ImCheckboxChecked size={15} id="correct" className="text-zinc-400 cursor-pointer hover:opacity-80 hover:transition-all" />
                      <VscErrorSmall id="wrong" size={32} className="text-zinc-400 cursor-pointer hover:opacity-80 hover:transition-all" />
                    </div>
                  </div>
                  <input
                    id="choise-input-5"
                    type="text"
                    className="h-12 w-full text-sm rounded-sm bg-transparent pl-2 pr-4 font-semibold outline-none border focus:border-violet-500 focus:ring focus:ring-violet-300 focus:ring-opacity-50 transition duration-200"
                    placeholder="digite uma alternativa aqui"
                  />
                </label>

                <label htmlFor="" className="min-md:flex min-md:justify-center">
                  <button type="submit" className="text-white bg-violet-500 h-14 rounded-sm shadow-sm w-full mt-4 font-bold uppercase text-sm hover:opacity-90 hover:transition-all min-md:max-w-[60%]">
                    Cadastrar Q&A
                  </button>
                </label>
              </form>
            </div>
          )}
        </div>
      </div>

      {showModal === '#modal-details' && (
        <Modal title="Detalhes do usuário" isOpen={showModal} onClose={handleCloseModal} className="w-[350px] h-[150px]">
          <div className="w-full flex flex-col gap-2">
            <h3 className="text-zinc-600">{selectedUser?.name}</h3>
            <button type="button" onClick={handleCopyPhone} className="w-full flex items-center gap-2 hover:opacity-80 hover:transition-all">
              <p className="text-zinc-400">{selectedUser?.phone}</p>
              <FaRegCopy className="text-zinc-400" />
              {copied && <span className="text-green-500 text-sm">Número copiado!</span>}
            </button>

          </div>
        </Modal>
      )}

      {showModal === '#modal-keywords' && (
        <Modal title="Detalhes" isOpen={showModal} onClose={handleCloseModal} className="w-[350px] h-[150px]">
          <div className="mt-4">
            <h3 className="text-zinc-600 font-semibold">Palavras-chave que foram cadastradas no QUIZ:</h3>

            <ul className="mt-2 flex flex-col gap-2">
              {selectedUser?.keywords?.map((keyword, index) => {
                return (
                  <li key={index}>Palavra-chave {<b>{index + 1}</b>} - {keyword}</li>
                )
              })}
            </ul>

            {selectedUser?.alreadyFilledQuiz === false && <p className="text-sm text-zinc-600 mt-4">O QUIZ ainda não foi preenchido por esse usuário.</p>}
          </div>
        </Modal>
      )}

      {showModal === '#modal-delete' && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-[999] flex items-center justify-center bg-black bg-opacity-85 max-md:px-5">
          <div className="flex flex-col rounded-lg bg-white p-6 w-[420px] max-md:w-[90%]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <BiTrashAlt size={32} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-red-600 text-center">Excluir todos os usuarios?</h2>
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 w-full">
                <p className="text-red-700 font-semibold text-sm text-center">
                  ATENCAO: Esta acao e IRREVERSIVEL!
                </p>
                <p className="text-red-600 text-xs text-center mt-1">
                  Todos os <strong>{users.length} usuarios</strong> serao excluidos permanentemente. Nao sera possivel recuperar os dados depois.
                </p>
              </div>
              <p className="text-zinc-500 text-xs text-center">
                Certifique-se de ter exportado os dados antes de continuar.
              </p>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 h-11 rounded-lg border-2 border-zinc-300 text-zinc-600 font-semibold text-sm hover:bg-zinc-50 transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeleteUsers}
                disabled={loadingDelete}
                className="flex-1 h-11 rounded-lg bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingDelete ? 'Excluindo...' : 'Sim, excluir tudo'}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  )
}
