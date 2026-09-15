import { useState } from 'react'
import { CalendarCheck, FileSpreadsheet, Link2, Plus } from 'lucide-react'

import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  IconButton,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
} from '@devclub/ui'

import { Event } from '../../../hooks/user'
import { quizAdminAPI } from '../../../services/api'
import { HandleAxiosAndGenericError, ToastifyDisplay } from '../../../utils'

type EventType = NonNullable<Event['type']>

interface EventBarProps {
  events: Event[]
  selectedEventId: string
  onSelect: (eventId: string) => void
  token?: string
  // Recarrega a lista de eventos; `selectId` seleciona o evento recém-criado.
  onChanged: (selectId?: string) => Promise<void> | void
  // Só o quiz exporta por aqui; o diploma tem o próprio botão dentro do painel.
  onExport?: () => void
}

// Tipo, status e a contagem certa para cada tipo de evento.
function optionLabel(ev: Event): string {
  const isDiploma = ev.type === 'diploma'
  const count = isDiploma ? (ev._count?.diplomaSubmissions ?? 0) : (ev._count?.participations ?? 0)
  return `${isDiploma ? '[Diploma] ' : ''}${ev.name}${ev.isActive ? ' (ativo)' : ''} · ${count} ${isDiploma ? 'envios' : 'leads'}`
}

/** Barra de eventos do dashboard: seleção, ativar/encerrar, link e criação. */
export function EventBar({ events, selectedEventId, onSelect, token, onChanged, onExport }: EventBarProps) {
  const [createOpen, setCreateOpen] = useState<boolean>(false)
  const [newEventName, setNewEventName] = useState<string>('')
  const [newEventType, setNewEventType] = useState<EventType>('quiz')
  const [loadingEvent, setLoadingEvent] = useState<boolean>(false)
  const [copiedLink, setCopiedLink] = useState<boolean>(false)

  const selectedEvent = events.find(e => e.id === selectedEventId)
  const authHeader = { Authorization: `Bearer ${token}` }

  // Diploma tem rota própria (/d); o quiz continua em /e.
  const eventLink = selectedEvent ? `${window.location.origin}/${selectedEvent.type === 'diploma' ? 'd' : 'e'}/${selectedEvent.slug}` : ''

  const handleCopyLink = (): void => {
    if (!eventLink) return
    navigator.clipboard.writeText(eventLink)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleCreateEvent = async (): Promise<void> => {
    if (!newEventName.trim()) return
    setLoadingEvent(true)
    try {
      const response = await quizAdminAPI('/admin/events', {
        method: 'POST',
        headers: authHeader,
        data: JSON.stringify({ name: newEventName.trim(), type: newEventType }),
      })
      if (response.status === 201) {
        setNewEventName('')
        setNewEventType('quiz')
        setCreateOpen(false)
        await onChanged(response.data.id)
        ToastifyDisplay({ toastType: 'success', message: 'Evento criado com sucesso.' })()
      }
    } catch {
      ToastifyDisplay({ toastType: 'error', message: 'Erro ao criar o evento.' })()
    } finally {
      setLoadingEvent(false)
    }
  }

  const handleActivateEvent = async (): Promise<void> => {
    if (!selectedEventId) return
    setLoadingEvent(true)
    try {
      const response = await quizAdminAPI(`/admin/events/${selectedEventId}/activate`, {
        method: 'PATCH',
        headers: authHeader,
      })
      if (response.status === 200) {
        await onChanged()
        ToastifyDisplay({ toastType: 'success', message: 'Evento ativado com sucesso.' })()
      }
    } catch (error) {
      // O servidor explica o motivo (ex.: diploma sem palavra-chave).
      ToastifyDisplay({ toastType: 'error', message: await HandleAxiosAndGenericError(error) })()
    } finally {
      setLoadingEvent(false)
    }
  }

  const handleDeactivateEvent = async (): Promise<void> => {
    if (!selectedEventId) return
    if (!window.confirm('Encerrar as participações deste evento? O link para de aceitar respostas.')) return
    setLoadingEvent(true)
    try {
      const response = await quizAdminAPI(`/admin/events/${selectedEventId}/deactivate`, {
        method: 'PATCH',
        headers: authHeader,
      })
      if (response.status === 200) {
        await onChanged()
        ToastifyDisplay({ toastType: 'success', message: 'Evento desativado. Participações encerradas.' })()
      }
    } catch {
      ToastifyDisplay({ toastType: 'error', message: 'Erro ao desativar o evento.' })()
    } finally {
      setLoadingEvent(false)
    }
  }

  return (
    <>
      <div className="border-line bg-surface mb-4 flex flex-wrap items-center gap-2 rounded-xl border p-3">
        <span className="text-label-sm tracking-caps text-fg-muted font-medium uppercase">Evento</span>
        <select
          value={selectedEventId}
          onChange={e => onSelect(e.target.value)}
          className="border-line bg-component text-copy-sm text-fg focus:border-brand rounded-md border px-3 py-2 outline-none"
        >
          {events.length === 0 && <option value="">Nenhum evento</option>}
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>
              {optionLabel(ev)}
            </option>
          ))}
        </select>

        {selectedEvent?.isActive ? (
          <>
            <Badge variant="brand" size="sm">
              Ativo
            </Badge>
            <Button variant="outline" size="sm" loading={loadingEvent} onClick={handleDeactivateEvent}>
              Encerrar
            </Button>
          </>
        ) : selectedEvent ? (
          <Button variant="outline" size="sm" loading={loadingEvent} onClick={handleActivateEvent}>
            <CalendarCheck className="size-4" /> Ativar
          </Button>
        ) : null}

        {selectedEvent && (
          <Button variant="ghost" size="sm" onClick={handleCopyLink} title={eventLink}>
            <Link2 className="size-4" /> {copiedLink ? 'Link copiado!' : 'Copiar link'}
          </Button>
        )}

        <div className="ml-auto flex items-center gap-1">
          <Button variant="secondary" size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" /> Criar evento
          </Button>
          {onExport && (
            <IconButton variant="ghost" size="sm" label="Exportar tabela do evento" title="Exportar tabela do evento" onClick={onExport}>
              <FileSpreadsheet />
            </IconButton>
          )}
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Criar novo evento</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <p className="text-copy-sm text-fg-subtle">
              Cada lead participa uma vez por evento. Crie um evento novo a cada semana — os anteriores ficam salvos.
            </p>
            <Input
              type="text"
              value={newEventName}
              onChange={e => setNewEventName(e.target.value)}
              placeholder="Ex.: Evento 12/08"
              maxLength={80}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCreateEvent()
              }}
            />
            <RadioGroup value={newEventType} onValueChange={value => setNewEventType(value as EventType)} aria-label="Tipo do evento" className="gap-2">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="quiz" id="new-event-type-quiz" />
                <Label htmlFor="new-event-type-quiz" className="font-normal">
                  Quiz (perguntas e nota)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="diploma" id="new-event-type-diploma" />
                <Label htmlFor="new-event-type-diploma" className="font-normal">
                  Diploma (sem quiz)
                </Label>
              </div>
            </RadioGroup>
            {newEventType === 'diploma' && (
              <p className="text-copy-sm text-fg-muted">
                A pessoa responde a avaliação e digita as palavras-chave para liberar o diploma. Configure antes de ativar.
              </p>
            )}
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="button" onClick={handleCreateEvent} loading={loadingEvent} disabled={!newEventName.trim()} className="flex-1">
              Criar evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
