import { Button, Card, CardContent } from '@devclub/ui'

interface DoneStepProps {
  name: string
  eventName: string
  certificateUrl?: string
}

export function DoneStep({ name, eventName, certificateUrl }: DoneStepProps) {
  const firstName = name.trim().split(/\s+/)[0]

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
        <div className="bg-brand-subtle flex size-16 items-center justify-center rounded-full text-3xl" aria-hidden>
          🎓
        </div>
        <h2 className="font-display text-h4 text-fg">Parabéns{firstName ? `, ${firstName}` : ''}!</h2>
        <p className="text-copy-sm text-fg-subtle md:text-copy">
          Você concluiu todas as etapas e o seu diploma do <b className="text-fg font-semibold">{eventName}</b> está liberado.
        </p>

        {certificateUrl ? (
          <Button asChild size="lg" className="mt-3 w-full md:w-auto">
            <a href={certificateUrl} target="_blank" rel="noopener noreferrer">
              📄 Baixar diploma
            </a>
          </Button>
        ) : (
          <p className="text-copy-sm text-error-fg">Não conseguimos carregar o link do diploma. Recarregue a página.</p>
        )}

        <p className="text-label-sm text-fg-muted">Nome no diploma: {name}</p>
      </CardContent>
    </Card>
  )
}
