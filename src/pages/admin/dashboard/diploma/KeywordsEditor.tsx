import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

import { Alert, AlertDescription, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, IconButton, Input, Label, Tag } from '@devclub/ui'

import { quizAdminAPI } from '../../../../services/api'
import { DiplomaKeywordTestResponse } from '../../../../types/diploma'
import { HandleAxiosAndGenericError, ToastifyDisplay } from '../../../../utils'
import { DraftKeyword, emptyKeyword, keywordsPayload } from '../../../../utils/diploma'

interface KeywordsEditorProps {
  keywords: DraftKeyword[]
  onChange: (keywords: DraftKeyword[]) => void
  token?: string
}

const MAX_KEYWORDS = 5
const MAX_VARIATIONS = 50
const MAX_LENGTH = 120

const warn = (message: string) => ToastifyDisplay({ toastType: 'warning', message })()

// "a, b" ou uma variação por linha viram itens separados.
const splitVariations = (text: string): string[] =>
  text
    .split(/[,\r\n]+/)
    .map(v => v.trim())
    .filter(Boolean)

export function KeywordsEditor({ keywords, onChange, token }: KeywordsEditorProps) {
  const [pending, setPending] = useState<Record<string, string>>({})
  const [testInputs, setTestInputs] = useState<string[]>([])
  const [testing, setTesting] = useState<boolean>(false)
  const [result, setResult] = useState<DiplomaKeywordTestResponse | null>(null)

  const auth = { Authorization: `Bearer ${token}` }
  const payload = keywordsPayload(keywords)
  const payloadJson = JSON.stringify(payload)
  // O participante recebe um campo por palavra-chave cadastrada.
  const testCount = Math.max(payload.length, 1)

  // Resultado de teste antigo não vale para palavras-chave editadas.
  useEffect(() => {
    setResult(null)
  }, [payloadJson])

  const update = (key: string, patch: Partial<DraftKeyword>) => onChange(keywords.map(k => (k.key === key ? { ...k, ...patch } : k)))

  const addVariations = (keyword: DraftKeyword, text: string): void => {
    setPending(p => ({ ...p, [keyword.key]: '' }))
    const parts = splitVariations(text)
    if (parts.length === 0) return

    const seen = new Set(keyword.variations.map(v => v.toLowerCase()))
    const next = [...keyword.variations]
    let tooLong = false
    for (const part of parts) {
      if (part.length > MAX_LENGTH) {
        tooLong = true
        continue
      }
      if (seen.has(part.toLowerCase())) continue
      seen.add(part.toLowerCase())
      next.push(part)
    }

    if (tooLong) warn(`Cada variação pode ter até ${MAX_LENGTH} caracteres.`)
    if (next.length > MAX_VARIATIONS) warn(`Cada palavra-chave aceita até ${MAX_VARIATIONS} variações.`)
    update(keyword.key, { variations: next.slice(0, MAX_VARIATIONS) })
  }

  const setTestInput = (index: number, value: string) => {
    setTestInputs(inputs => {
      const next = [...inputs]
      next[index] = value
      return next
    })
    setResult(null)
  }

  const runTest = async (): Promise<void> => {
    if (payload.length === 0) {
      warn('Cadastre ao menos 1 palavra-chave para testar.')
      return
    }
    setTesting(true)
    try {
      const inputs = Array.from({ length: testCount }, (_, i) => testInputs[i] ?? '')
      const response = await quizAdminAPI('/admin/diploma/keywords/test', {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        data: JSON.stringify({ keywords: payload, inputs }),
      })
      setResult(response.data as DiplomaKeywordTestResponse)
    } catch (error) {
      ToastifyDisplay({ toastType: 'error', message: await HandleAxiosAndGenericError(error) })()
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Alert variant="info">
        <AlertDescription>
          As palavras-chave nunca são enviadas ao participante; a conferência é feita no servidor e ignora espaços, maiúsculas, acentos e pontuação.
        </AlertDescription>
      </Alert>

      {keywords.map((keyword, index) => (
        <Card key={keyword.key}>
          <CardHeader className="flex-row items-center justify-between gap-2 pb-3">
            <CardTitle className="text-label text-fg-muted font-medium">Palavra-chave {index + 1}</CardTitle>
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              label="Remover palavra-chave"
              disabled={keywords.length <= 1}
              onClick={() => onChange(keywords.filter(k => k.key !== keyword.key))}
            >
              <Trash2 />
            </IconButton>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`kw-answer-${keyword.key}`}>Palavra principal</Label>
              <Input
                id={`kw-answer-${keyword.key}`}
                value={keyword.answer}
                onChange={e => update(keyword.key, { answer: e.target.value })}
                placeholder="Ex.: Inteligência Artificial"
                maxLength={MAX_LENGTH}
                autoComplete="off"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`kw-variation-${keyword.key}`}>
                Variações aceitas
                <span className="text-label-xs text-fg-muted font-mono font-normal">
                  ({keyword.variations.length}/{MAX_VARIATIONS})
                </span>
              </Label>
              {keyword.variations.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {keyword.variations.map(variation => (
                    <Tag
                      key={variation}
                      className="max-w-full"
                      removeLabel={`Remover variação ${variation}`}
                      onRemove={() => update(keyword.key, { variations: keyword.variations.filter(v => v !== variation) })}
                    >
                      <span className="truncate">{variation}</span>
                    </Tag>
                  ))}
                </div>
              )}
              <Input
                id={`kw-variation-${keyword.key}`}
                inputSize="sm"
                value={pending[keyword.key] ?? ''}
                placeholder="Digite e aperte Enter, ou cole várias separadas por vírgula"
                autoComplete="off"
                onChange={e => setPending(p => ({ ...p, [keyword.key]: e.target.value }))}
                onKeyDown={e => {
                  if (e.key !== 'Enter') return
                  e.preventDefault()
                  addVariations(keyword, pending[keyword.key] ?? '')
                }}
                onPaste={e => {
                  const text = e.clipboardData.getData('text')
                  if (!/[,\r\n]/.test(text)) return
                  e.preventDefault()
                  addVariations(keyword, `${pending[keyword.key] ?? ''},${text}`)
                }}
                // Variação digitada sem Enter não se perde ao clicar em outro lugar.
                onBlur={() => addVariations(keyword, pending[keyword.key] ?? '')}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        size="sm"
        variant="ghost"
        className="self-start"
        disabled={keywords.length >= MAX_KEYWORDS}
        onClick={() => onChange([...keywords, emptyKeyword()])}
      >
        <Plus className="size-4" /> Adicionar palavra-chave ({keywords.length}/{MAX_KEYWORDS})
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-h5">Testar</CardTitle>
          <CardDescription>Digite como um participante digitaria. O teste usa as palavras-chave acima, mesmo antes de salvar.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {Array.from({ length: testCount }, (_, i) => (
            <div key={i} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
              <Input
                inputSize="sm"
                value={testInputs[i] ?? ''}
                onChange={e => setTestInput(i, e.target.value)}
                placeholder={`Palavra-chave ${i + 1}`}
                maxLength={MAX_LENGTH}
                autoComplete="off"
                spellCheck={false}
                className="sm:max-w-xs"
              />
              {result && (
                <span className="text-label-sm text-fg-muted truncate font-mono" title={result.normalized[i]}>
                  normalizado: “{result.normalized[i] ?? ''}”
                </span>
              )}
            </div>
          ))}

          <div className="flex items-center gap-3">
            <Button size="sm" variant="secondary" onClick={runTest} loading={testing}>
              Testar
            </Button>
            {result &&
              (result.passed ? (
                <span className="text-copy-sm text-success-fg font-medium">✓ Liberaria o diploma</span>
              ) : (
                <span className="text-copy-sm text-error-fg font-medium">✗ Não liberaria o diploma</span>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
