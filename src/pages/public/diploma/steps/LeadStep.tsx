import { FormEvent, useState } from 'react'
import InputMask from 'react-input-mask'

import { LuPhone } from 'react-icons/lu'
import { RiUser3Line } from 'react-icons/ri'
import { MdOutlineEmail } from 'react-icons/md'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Field,
  FieldControl,
  FieldHint,
  FieldLabel,
  Input,
  inputVariants,
} from '@devclub/ui'

import { ToastifyDisplay } from '../../../../utils'

// Fica só em memória: e-mail e telefone não vão para o localStorage.
export interface LeadValues {
  name: string
  email: string
  brPhone: string
  foreignPhone: string
  isForeigner: boolean
  consent: boolean
}

export const emptyLead: LeadValues = {
  name: '',
  email: '',
  brPhone: '',
  foreignPhone: '',
  isForeigner: false,
  consent: false,
}

interface LeadStepProps {
  initial: LeadValues
  loading: boolean
  onSubmit: (values: LeadValues) => void
  // Voltando pelo "editar" das palavras-chave: permite desistir sem reenviar.
  onCancel?: () => void
}

export function LeadStep({ initial, loading, onSubmit, onCancel }: LeadStepProps) {
  const [values, setValues] = useState<LeadValues>(initial)

  const setField = <K extends keyof LeadValues>(field: K, value: LeadValues[K]) => setValues(prev => ({ ...prev, [field]: value }))

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    // Mesmas faixas do servidor: 10–11 dígitos no Brasil, 6–15 para estrangeiro.
    const digits = (values.isForeigner ? values.foreignPhone : values.brPhone).replace(/\D/g, '')
    const [min, max] = values.isForeigner ? [6, 15] : [10, 11]
    if (digits.length < min || digits.length > max) {
      const message = values.isForeigner ? 'Informe seu WhatsApp com o código do país.' : 'Informe seu WhatsApp completo, com DDD.'
      ToastifyDisplay({ toastType: 'warning', message })()
      return
    }

    if (!values.consent) {
      ToastifyDisplay({ toastType: 'warning', message: 'Você precisa concordar com a Política de Privacidade para continuar.' })()
      return
    }

    onSubmit(values)
  }

  const maskClassName = inputVariants({ inputSize: 'md' })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display">Preencha seus dados</CardTitle>
        <CardDescription>São os dados usados para emitir o seu diploma.</CardDescription>
      </CardHeader>

      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Field>
            <FieldLabel className="flex items-center gap-2">
              <RiUser3Line className="text-fg-muted" size={18} />
              Nome completo
            </FieldLabel>
            <FieldControl>
              <Input
                type="text"
                autoComplete="name"
                placeholder="Seu nome completo"
                value={values.name}
                onChange={e => setField('name', e.target.value)}
                required
                maxLength={128}
                minLength={3}
              />
            </FieldControl>
            <FieldHint>Como deve aparecer no diploma</FieldHint>
          </Field>

          <Field>
            <FieldLabel className="flex items-center gap-2">
              <MdOutlineEmail className="text-fg-muted" size={18} />
              E-mail
            </FieldLabel>
            <FieldControl>
              <Input
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="Seu e-mail"
                value={values.email}
                onChange={e => setField('email', e.target.value)}
                required
                maxLength={128}
              />
            </FieldControl>
          </Field>

          <label className="text-copy-sm text-fg-subtle flex items-center gap-2 select-none">
            <input type="checkbox" checked={values.isForeigner} onChange={e => setField('isForeigner', e.target.checked)} className="accent-brand size-4" />
            <span>Sou estrangeiro</span>
          </label>

          <Field>
            <FieldLabel className="flex items-center gap-2">
              <LuPhone className="text-fg-muted" size={18} />
              WhatsApp
            </FieldLabel>
            <FieldControl>
              {values.isForeigner ? (
                <Input
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="Seu WhatsApp + código do país"
                  value={values.foreignPhone}
                  onChange={e => setField('foreignPhone', e.target.value)}
                  required
                  maxLength={86}
                  minLength={6}
                />
              ) : (
                <InputMask
                  mask="(99) 99999-9999"
                  value={values.brPhone}
                  onChange={e => setField('brPhone', e.target.value)}
                  className={maskClassName}
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="Seu WhatsApp com DDD"
                  required
                />
              )}
            </FieldControl>
          </Field>

          <label className="flex cursor-pointer items-start gap-3">
            <Checkbox className="mt-0.5" checked={values.consent} onCheckedChange={checked => setField('consent', checked === true)} />
            <span className="text-copy-sm text-fg-subtle">
              Li e concordo com a{' '}
              <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer" className="text-fg-brand underline-offset-4 hover:underline">
                Política de Privacidade
              </a>
              .
            </span>
          </label>

          <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
            {loading ? 'Enviando...' : 'Continuar'}
          </Button>

          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel} disabled={loading} className="w-full">
              Cancelar
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
