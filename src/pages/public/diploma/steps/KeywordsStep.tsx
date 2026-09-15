import { FormEvent, useEffect, useRef, useState } from 'react'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Field, FieldControl, FieldError, FieldLabel, Input } from '@devclub/ui'

import type { DiplomaAttemptResponse } from '../../../../types/diploma'

interface KeywordsStepProps {
  keywordCount: number
  name: string
  loading: boolean
  // Resolve null quando a chamada falhou (o container já mostrou o toast).
  onSubmit: (keywords: string[]) => Promise<DiplomaAttemptResponse | null>
  onEditName: () => void
}

export function KeywordsStep({ keywordCount, name, loading, onSubmit, onEditName }: KeywordsStepProps) {
  const [values, setValues] = useState<string[]>(() => Array.from({ length: keywordCount }, () => ''))
  const [error, setError] = useState<string | null>(null)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  // Se o admin mudar a quantidade de palavras, ajusta os campos sem perder o que já foi digitado.
  useEffect(() => {
    setValues(prev => Array.from({ length: keywordCount }, (_, i) => prev[i] ?? ''))
  }, [keywordCount])

  const handleChange = (index: number, text: string) => {
    setValues(prev => prev.map((value, i) => (i === index ? text : value)))
    setError(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (loading) return

    const emptyIndex = values.findIndex(value => !value.trim())
    if (emptyIndex !== -1) {
      setError('Preencha todas as palavras-chave.')
      inputsRef.current[emptyIndex]?.focus()
      return
    }

    // Tentativas ilimitadas: em caso de erro os campos ficam como estão para corrigir na hora.
    const result = await onSubmit(values)
    if (result && !result.passed) {
      setError(result.message)
      inputsRef.current[0]?.focus()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display">Digite as palavras-chave</CardTitle>
        <CardDescription>Elas foram passadas durante o evento. A ordem não importa.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="border-line bg-component flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border px-3 py-2">
            <span className="text-copy-sm text-fg-subtle">
              Nome no diploma: <b className="text-fg font-semibold">{name}</b>
            </span>
            <Button type="button" variant="link" size="sm" onClick={onEditName} disabled={loading} className="h-auto px-0">
              editar
            </Button>
          </div>

          {values.map((value, index) => (
            <Field key={index} invalid={!!error}>
              <FieldLabel>Palavra-chave {index + 1}</FieldLabel>
              <FieldControl>
                <Input
                  ref={element => {
                    inputsRef.current[index] = element
                  }}
                  value={value}
                  onChange={e => handleChange(index, e.target.value)}
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={120}
                  invalid={!!error}
                  aria-required
                />
              </FieldControl>
              {index === values.length - 1 && <FieldError>{error}</FieldError>}
            </Field>
          ))}

          <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
            Liberar diploma
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
