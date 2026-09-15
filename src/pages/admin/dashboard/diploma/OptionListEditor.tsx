import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'

import { Button, IconButton, Input } from '@devclub/ui'

import { DraftOption, emptyOption, moveItem } from '../../../../utils/diploma'

interface OptionListEditorProps {
  options: DraftOption[]
  onChange: (options: DraftOption[]) => void
  placeholder?: string
  addLabel?: string
}

/** Lista editável de opções: o id de cada opção acompanha o rótulo ao editar e reordenar. */
export function OptionListEditor({ options, onChange, placeholder = 'Opção', addLabel = 'Adicionar opção' }: OptionListEditorProps) {
  const updateLabel = (key: string, label: string) => onChange(options.map(o => (o.key === key ? { ...o, label } : o)))

  return (
    <div className="flex flex-col gap-2">
      {options.length === 0 && <p className="text-copy-sm text-fg-muted">Nenhuma opção ainda.</p>}

      {options.map((option, index) => (
        <div key={option.key} className="flex items-center gap-1">
          <span className="text-label-sm text-fg-muted w-6 shrink-0 text-center font-mono">{index + 1}</span>
          <Input
            inputSize="sm"
            value={option.label}
            onChange={e => updateLabel(option.key, e.target.value)}
            placeholder={`${placeholder} ${index + 1}`}
            maxLength={200}
          />
          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            label="Mover opção para cima"
            disabled={index === 0}
            onClick={() => onChange(moveItem(options, index, -1))}
          >
            <ArrowUp />
          </IconButton>
          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            label="Mover opção para baixo"
            disabled={index === options.length - 1}
            onClick={() => onChange(moveItem(options, index, 1))}
          >
            <ArrowDown />
          </IconButton>
          <IconButton type="button" variant="ghost" size="sm" label="Remover opção" onClick={() => onChange(options.filter(o => o.key !== option.key))}>
            <Trash2 />
          </IconButton>
        </div>
      ))}

      <Button size="sm" variant="ghost" onClick={() => onChange([...options, emptyOption()])} className="self-start">
        <Plus className="size-4" /> {addLabel}
      </Button>
    </div>
  )
}
