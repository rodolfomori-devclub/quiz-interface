import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'

import { Button, IconButton, Spinner, Tabs, TabsContent, TabsList, TabsTrigger } from '@devclub/ui'

import { Event } from '../../../../hooks/user'
import { quizAdminAPI } from '../../../../services/api'
import { DiplomaConfig, DiplomaSubmission } from '../../../../types/diploma'
import { HandleAxiosAndGenericError, ToastifyDisplay } from '../../../../utils'
import { DiplomaConfigEditor } from './DiplomaConfigEditor'
import { DiplomaResults } from './DiplomaResults'
import { DiplomaSubmissions } from './DiplomaSubmissions'

interface DiplomaPanelProps {
  event: Event
  token?: string
}

type PanelTab = 'envios' | 'resultados' | 'config'

/** Painel do evento do tipo diploma. O dashboard monta com `key={event.id}`, então trocar de evento zera o estado. */
export function DiplomaPanel({ event, token }: DiplomaPanelProps) {
  const [tab, setTab] = useState<PanelTab>('envios')
  const [submissions, setSubmissions] = useState<DiplomaSubmission[]>([])
  const [config, setConfig] = useState<DiplomaConfig | null>(null)
  const [loadingSubmissions, setLoadingSubmissions] = useState<boolean>(false)
  const [loadingConfig, setLoadingConfig] = useState<boolean>(false)

  const auth = { Authorization: `Bearer ${token}` }

  const loadSubmissions = async (): Promise<void> => {
    setLoadingSubmissions(true)
    try {
      const response = await quizAdminAPI(`/admin/events/${event.id}/diploma-submissions`, { method: 'GET', headers: auth })
      setSubmissions(response.data as DiplomaSubmission[])
    } catch (error) {
      ToastifyDisplay({ toastType: 'error', message: await HandleAxiosAndGenericError(error) })()
    } finally {
      setLoadingSubmissions(false)
    }
  }

  const loadConfig = async (): Promise<void> => {
    setLoadingConfig(true)
    try {
      const response = await quizAdminAPI(`/admin/events/${event.id}/diploma-config`, { method: 'GET', headers: auth })
      setConfig(response.data as DiplomaConfig)
    } catch (error) {
      ToastifyDisplay({ toastType: 'error', message: await HandleAxiosAndGenericError(error) })()
    } finally {
      setLoadingConfig(false)
    }
  }

  // Carrega uma vez por evento (o painel é remontado a cada troca de evento).
  useEffect(() => {
    loadSubmissions()
    loadConfig()
  }, [event.id])

  // Enquanto a config não chega (ou falhou), as abas que dependem dela mostram isto.
  const configFallback = (
    <div className="flex flex-col items-center gap-3 py-10">
      {loadingConfig ? (
        <Spinner className="text-fg-muted size-6" />
      ) : (
        <>
          <p className="text-copy-sm text-fg-muted">Não foi possível carregar a configuração do diploma.</p>
          <Button size="sm" variant="outline" onClick={loadConfig}>
            Tentar de novo
          </Button>
        </>
      )}
    </div>
  )

  return (
    <Tabs value={tab} onValueChange={value => setTab(value as PanelTab)}>
      <div className="flex items-center justify-between gap-4">
        <TabsList>
          <TabsTrigger value="envios">Envios</TabsTrigger>
          <TabsTrigger value="resultados">Resultados</TabsTrigger>
          <TabsTrigger value="config">Configuração</TabsTrigger>
        </TabsList>
        <IconButton variant="ghost" size="sm" label="Atualizar envios" title="Atualizar envios" loading={loadingSubmissions} onClick={loadSubmissions}>
          <RefreshCw />
        </IconButton>
      </div>

      <TabsContent value="envios">
        <DiplomaSubmissions
          submissions={submissions}
          config={config}
          eventName={event.name}
          loading={loadingSubmissions}
          token={token}
          onDeleted={loadSubmissions}
        />
      </TabsContent>

      <TabsContent value="resultados">{config ? <DiplomaResults submissions={submissions} config={config} /> : configFallback}</TabsContent>

      {/* Sempre montado: trocar de aba não descarta o rascunho não salvo. */}
      <TabsContent value="config" forceMount className="data-[state=inactive]:hidden">
        {config ? <DiplomaConfigEditor eventId={event.id} isActive={event.isActive} token={token} config={config} onSaved={setConfig} /> : configFallback}
      </TabsContent>
    </Tabs>
  )
}
