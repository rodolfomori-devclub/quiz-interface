import { useEffect, useState } from "react"

import { User, useUser } from "../../../hooks/user"
import { ToastifyDisplay } from "../../../utils"
import { quizAdminAPI } from "../../../services/api"

import { AdminPrivateHeader } from "../../../components/AdminPrivateHeader"
import { feedbackToReadable } from "../../../utils/eventFeedback"
import { FeedbackResults } from "./FeedbackResults"

import {
  Button,
  IconButton,
  Input,
  StatCard,
  Spinner,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@devclub/ui"

import {
  Trash2,
  FileSpreadsheet,
  Send,
  Copy,
  CheckSquare,
  CircleX,
  Users,
} from "lucide-react"

import * as XLSX from 'xlsx'

type MenuOptions = 'dashboard' | 'feedback' | 'Q&A'

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
      filteredUsers.map((user, index) => {
        const fb = feedbackToReadable(user.eventFeedback)
        return {
          "#": index + 1,
          "Nome Completo": user.name,
          "CPF": user.document,
          "Telefone": user.phone,
          "Nota": user.finalGrade !== null ? user.finalGrade : 'Não preenchido',
          "Palavras-chave": user?.keywords!.length > 0 ? user?.keywords!.join(', ') : 'Nenhuma',
          "NPS (0-10)": fb.nps,
          "Aulas assistidas": fb.attendance,
          "Formato": fb.consumptionFormat,
          "O que marcou": fb.highlight,
          "Sentimento pós-evento": fb.transformation,
          "Status DevClub": fb.devclubStatus,
          "Obstáculo": fb.obstacle,
          "Sugestão de melhoria": fb.improvement,
        }
      })
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
    setMenuOptions(menuType)
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

  const handleFeedbackModal = (user: User): void => {
    setSelectedUser(user)
    setShowModal('#modal-feedback')
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

  return (
    <>
      <div className="w-full min-h-screen">
        <AdminPrivateHeader />

        <div className="mx-auto mt-5 w-full max-w-5xl px-4">
          <Tabs value={menuOptions} onValueChange={(value) => handleChangeMenuType(value as MenuOptions)}>
            <div className="flex items-center justify-between gap-4">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="feedback">Pré-quiz</TabsTrigger>
                <TabsTrigger value="Q&A">Q&A</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-1">
                <IconButton
                  variant="ghost"
                  size="sm"
                  label="Excluir todos os usuários"
                  title="Excluir todos os usuários"
                  onClick={handleDeleteUsers}
                >
                  <Trash2 />
                </IconButton>
                <IconButton
                  variant="ghost"
                  size="sm"
                  label="Exportar tabela de usuários"
                  title="Exportar tabela de usuários"
                  onClick={exportToXLSX}
                >
                  <FileSpreadsheet />
                </IconButton>
              </div>
            </div>

            <TabsContent value="dashboard">
              <div className="flex flex-col gap-4">
                <StatCard
                  label="Qtd. Total"
                  value={filteredUsers?.length ?? 0}
                  icon={<Users />}
                  className="max-w-xs"
                />

                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    inputSize="sm"
                    value={searchUser}
                    onChange={e => setSearchUser(e.target.value)}
                    placeholder="Pesquisar por nome de usuário..."
                    className="w-full sm:w-80"
                    maxLength={128}
                    autoComplete="true"
                  />

                  {loadingFilter ?
                    <Spinner className="size-5 text-fg-muted" />
                    :
                    <IconButton
                      id="search-user-button"
                      type="button"
                      variant="ghost"
                      size="sm"
                      label="Pesquisar"
                      title="Pesquisar"
                      onClick={handleSearch}
                    >
                      <Send />
                    </IconButton>
                  }
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-line bg-surface">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Nota QUIZ</TableHead>
                      <TableHead>Palavras-chave</TableHead>
                      <TableHead>Feedback</TableHead>
                      <TableHead>Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="max-w-[280px] truncate">{user.name}</TableCell>
                        <TableCell className="font-mono">{user.document!.slice(0, 3)}***</TableCell>
                        <TableCell className="font-mono">{user.phone!.slice(0, 7)}****</TableCell>
                        <TableCell className="font-mono">{user.finalGrade !== -1 ? user.finalGrade : 'Não preenchido'}</TableCell>
                        <TableCell className="text-center">
                          <span
                            className="cursor-pointer text-fg-brand hover:opacity-80 transition-opacity"
                            onClick={() => handleKeywordsModal(user)}
                          >
                            Ver
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {user.eventFeedback ? (
                            <span
                              className="cursor-pointer text-fg-brand hover:opacity-80 transition-opacity"
                              onClick={() => handleFeedbackModal(user)}
                            >
                              Ver
                            </span>
                          ) : (
                            <span className="text-fg-muted">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className="cursor-pointer text-fg-brand hover:opacity-80 transition-opacity"
                            onClick={() => handleModal(user)}
                          >
                            Ver
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="feedback">
              <FeedbackResults users={users} onOpenIndividual={handleFeedbackModal} />
            </TabsContent>

            <TabsContent value="Q&A">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-h5 font-semibold text-fg">Adicionar Perguntas</h3>
                  <p className="text-copy-sm text-fg-subtle">Marque se a alternativa é <b>verdadeira</b> ou <b>falsa</b> pelos ícones ao lado do texto</p>
                </div>
                <form onSubmit={() => { }} className="flex flex-col gap-4">
                  <label htmlFor="" className="flex flex-col gap-1.5">
                    <span className="text-label font-medium text-fg">Questão</span>
                    <Input
                      id="question-input"
                      type="text"
                      inputSize="lg"
                      placeholder="digite a pergunta aqui"
                      required
                    />
                  </label>

                  <label htmlFor="" className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between max-w-[180px]">
                      <span className="text-label font-medium text-fg">Alternativa #1</span>
                      <div id="alternative-1" className="flex items-center gap-1">
                        <CheckSquare size={16} id="correct" className="text-fg-muted cursor-pointer hover:text-fg-brand transition-colors" />
                        <CircleX size={20} id="wrong" className="text-fg-muted cursor-pointer hover:text-error-fg transition-colors" />
                      </div>
                    </div>
                    <Input
                      id="choise-input-1"
                      type="text"
                      inputSize="lg"
                      placeholder="digite uma alternativa aqui"
                      required
                    />
                  </label>

                  <label htmlFor="" className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between max-w-[180px]">
                      <span className="text-label font-medium text-fg">Alternativa #2</span>
                      <div id="alternative-2" className="flex items-center gap-1">
                        <CheckSquare size={16} id="correct" className="text-fg-muted cursor-pointer hover:text-fg-brand transition-colors" />
                        <CircleX size={20} id="wrong" className="text-fg-muted cursor-pointer hover:text-error-fg transition-colors" />
                      </div>
                    </div>
                    <Input
                      id="choise-input-2"
                      type="text"
                      inputSize="lg"
                      placeholder="digite uma alternativa aqui"
                      required
                    />
                  </label>

                  <label htmlFor="" className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between max-w-[180px]">
                      <span className="text-label font-medium text-fg">Alternativa #3</span>
                      <div id="alternative-3" className="flex items-center gap-1">
                        <CheckSquare size={16} id="correct" className="text-fg-muted cursor-pointer hover:text-fg-brand transition-colors" />
                        <CircleX size={20} id="wrong" className="text-fg-muted cursor-pointer hover:text-error-fg transition-colors" />
                      </div>
                    </div>
                    <Input
                      id="choise-input-3"
                      type="text"
                      inputSize="lg"
                      placeholder="digite uma alternativa aqui"
                      required
                    />
                  </label>

                  <label htmlFor="" className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between max-w-[180px]">
                      <span className="text-label font-medium text-fg">Alternativa #4</span>
                      <div id="alternative-4" className="flex items-center gap-1">
                        <CheckSquare size={16} id="correct" className="text-fg-muted cursor-pointer hover:text-fg-brand transition-colors" />
                        <CircleX size={20} id="wrong" className="text-fg-muted cursor-pointer hover:text-error-fg transition-colors" />
                      </div>
                    </div>
                    <Input
                      id="choise-input-4"
                      type="text"
                      inputSize="lg"
                      placeholder="digite uma alternativa aqui"
                      required
                    />
                  </label>

                  <label htmlFor="" className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between max-w-[265px]">
                      <span className="text-label font-medium text-fg">Alternativa #5 (opcional)</span>
                      <div id="alternative-5" className="flex items-center gap-1">
                        <CheckSquare size={16} id="correct" className="text-fg-muted cursor-pointer hover:text-fg-brand transition-colors" />
                        <CircleX size={20} id="wrong" className="text-fg-muted cursor-pointer hover:text-error-fg transition-colors" />
                      </div>
                    </div>
                    <Input
                      id="choise-input-5"
                      type="text"
                      inputSize="lg"
                      placeholder="digite uma alternativa aqui"
                    />
                  </label>

                  <div className="mt-4 md:flex md:justify-center">
                    <Button type="submit" size="lg" className="w-full md:max-w-[60%]">
                      Cadastrar Q&A
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={showModal === '#modal-details'} onOpenChange={(open) => { if (!open) handleCloseModal() }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Detalhes do usuário</DialogTitle>
          </DialogHeader>
          <div className="w-full flex flex-col gap-2">
            <h3 className="text-fg">{selectedUser?.name}</h3>
            <button type="button" onClick={handleCopyPhone} className="w-full flex items-center gap-2 hover:opacity-80 transition-opacity">
              <p className="font-mono text-fg-subtle">{selectedUser?.phone}</p>
              <Copy className="size-4 text-fg-muted" />
              {copied && <span className="text-success-fg text-copy-sm">Número copiado!</span>}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showModal === '#modal-keywords'} onOpenChange={(open) => { if (!open) handleCloseModal() }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Detalhes</DialogTitle>
          </DialogHeader>
          <div>
            <h3 className="font-semibold text-fg">Palavras-chave que foram cadastradas no QUIZ:</h3>

            <ul className="mt-2 flex flex-col gap-2 text-fg">
              {selectedUser?.keywords?.map((keyword, index) => {
                return (
                  <li key={index}>Palavra-chave {<b>{index + 1}</b>} - {keyword}</li>
                )
              })}
            </ul>

            {selectedUser?.alreadyFilledQuiz === false && <p className="text-copy-sm text-fg-subtle mt-4">O QUIZ ainda não foi preenchido por esse usuário.</p>}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showModal === '#modal-feedback'} onOpenChange={(open) => { if (!open) handleCloseModal() }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Feedback do evento</DialogTitle>
          </DialogHeader>
          <div>
            <h3 className="font-semibold text-fg mb-3">{selectedUser?.name}</h3>
            {(() => {
              const fb = feedbackToReadable(selectedUser?.eventFeedback)
              const rows: { label: string; value: string }[] = [
                { label: 'NPS (0-10)', value: fb.nps },
                { label: 'Aulas assistidas', value: fb.attendance },
                { label: 'Formato', value: fb.consumptionFormat },
                { label: 'O que marcou', value: fb.highlight },
                { label: 'Sentimento pós-evento', value: fb.transformation },
                { label: 'Status DevClub', value: fb.devclubStatus },
                { label: 'Obstáculo', value: fb.obstacle },
                { label: 'Sugestão de melhoria', value: fb.improvement },
              ]
              return (
                <ul className="flex flex-col gap-2">
                  {rows.map(row => (
                    <li key={row.label} className="text-copy-sm text-fg-subtle flex flex-col">
                      <span className="text-label-xs font-semibold text-fg-muted uppercase tracking-caps">{row.label}</span>
                      <span>{row.value}</span>
                    </li>
                  ))}
                </ul>
              )
            })()}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showModal === '#modal-delete'} onOpenChange={(open) => { if (!open) handleCloseModal() }}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-error-bg flex items-center justify-center">
              <Trash2 className="size-8 text-error-fg" />
            </div>
            <DialogTitle className="text-xl text-error-fg text-center">Excluir todos os usuarios?</DialogTitle>
            <div className="bg-error-bg border border-error-line rounded-lg p-4 w-full">
              <p className="text-error-fg font-semibold text-copy-sm text-center">
                ATENCAO: Esta acao e IRREVERSIVEL!
              </p>
              <p className="text-error-fg text-label-sm text-center mt-1">
                Todos os <strong>{users.length} usuarios</strong> serao excluidos permanentemente. Nao sera possivel recuperar os dados depois.
              </p>
            </div>
            <p className="text-fg-muted text-label-sm text-center">
              Certifique-se de ter exportado os dados antes de continuar.
            </p>
          </div>
          <DialogFooter className="mt-5">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDeleteUsers}
              disabled={loadingDelete}
              className="flex-1"
            >
              {loadingDelete ? 'Excluindo...' : 'Sim, excluir tudo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
