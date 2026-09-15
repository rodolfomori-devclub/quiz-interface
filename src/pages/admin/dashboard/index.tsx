import { useEffect, useState } from "react"

import { User, Event, useUser } from "../../../hooks/user"
import { ToastifyDisplay } from "../../../utils"
import { quizAdminAPI } from "../../../services/api"

import { AdminPrivateHeader } from "../../../components/AdminPrivateHeader"
import { feedbackToReadable } from "../../../utils/eventFeedback"
import { FeedbackResults } from "./FeedbackResults"
import { QuestionsEditor } from "./QuestionsEditor"
import { EventBar } from './EventBar'
import { DiplomaPanel } from './diploma/DiplomaPanel'

import {
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
} from "@devclub/ui"

import {
  Send,
  Copy,
  Users,
} from "lucide-react"

import * as XLSX from 'xlsx'

type MenuOptions = 'dashboard' | 'feedback' | 'Q&A'

export function AdminDashboard() {
  const { adminData } = useUser()
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchUser, setSearchUser] = useState<string>('')

  const [loadingFilter, setLoadingFilter] = useState<boolean>(false)

  const [menuOptions, setMenuOptions] = useState<MenuOptions>('dashboard')

  const [selectedUser, setSelectedUser] = useState<User>({})
  const [showModal, setShowModal] = useState<string>('#0')
  const [copied, setCopied] = useState<boolean>(false)

  const selectedEvent = events.find(e => e.id === selectedEventId)
  // Evento diploma não usa leads nem abas do quiz: tudo dele fica no DiplomaPanel.
  const isDiploma = selectedEvent?.type === 'diploma'
  const authHeader = { Authorization: `Bearer ${adminData?.token}` }

  const handleQueryEvents = async (): Promise<void> => {
    try {
      const response = await quizAdminAPI('/admin/events', { method: 'GET', headers: authHeader })

      if (response.status === 200) {
        const list: Event[] = response.data
        setEvents(list)
        setSelectedEventId(prev => {
          if (prev && list.some(e => e.id === prev)) return prev
          const active = list.find(e => e.isActive) ?? list[0]
          return active?.id ?? ''
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleQueryLeads = async (eventId: string): Promise<void> => {
    try {
      const response = await quizAdminAPI(`/admin/events/${eventId}/leads`, { method: 'GET', headers: authHeader })

      if (response.status === 200) {
        setUsers(response.data)
        setFilteredUsers(response.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Chamado pela EventBar depois de criar, ativar ou encerrar; `selectId` seleciona o evento criado.
  const handleEventsChanged = async (selectId?: string): Promise<void> => {
    await handleQueryEvents()
    if (selectId) setSelectedEventId(selectId)
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
          "Projeto favorito": fb.favoriteProject,
          "Agente de IA (o que achou)": fb.aiAgentRating,
          "Sentimento pós-evento": fb.transformation,
          "Status DevClub": fb.devclubStatus,
          "Obstáculo": fb.obstacle,
          "Sugestão de melhoria": fb.improvement,
        }
      })
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuários")
    const safeName = (selectedEvent?.name ?? 'evento').replace(/[^a-z0-9]+/gi, '_').toLowerCase()
    XLSX.writeFile(workbook, `usuarios_quiz_${safeName}.xlsx`)

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

  useEffect(() => {
    handleQueryEvents()
  }, [])

  useEffect(() => {
    if (selectedEventId && !isDiploma) {
      handleQueryLeads(selectedEventId)
    }
  }, [selectedEventId, isDiploma])

  return (
    <>
      <div className="w-full min-h-screen">
        <AdminPrivateHeader />

        <div className="mx-auto mt-5 w-full max-w-5xl px-4">
          {/* Barra de eventos — dados abaixo são do evento selecionado */}
          <EventBar
            events={events}
            selectedEventId={selectedEventId}
            onSelect={setSelectedEventId}
            token={adminData?.token}
            onChanged={handleEventsChanged}
            onExport={isDiploma ? undefined : exportToXLSX}
          />

          {selectedEvent && isDiploma ? (
            <DiplomaPanel key={selectedEvent.id} event={selectedEvent} token={adminData?.token} />
          ) : (
            <Tabs value={menuOptions} onValueChange={(value) => handleChangeMenuType(value as MenuOptions)}>
              <div className="flex items-center justify-between gap-4">
                <TabsList>
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="feedback">Pré-quiz</TabsTrigger>
                  <TabsTrigger value="Q&A">Q&A</TabsTrigger>
                </TabsList>
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
                {selectedEventId ? (
                  <QuestionsEditor
                    eventId={selectedEventId}
                    token={adminData?.token}
                    eventName={selectedEvent?.name}
                  />
                ) : (
                  <p className="text-copy-sm text-fg-muted py-6 text-center">
                    Selecione um evento para editar as perguntas.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          )}
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
                { label: 'Projeto favorito', value: fb.favoriteProject },
                { label: 'Agente de IA (o que achou)', value: fb.aiAgentRating },
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

    </>
  )
}
