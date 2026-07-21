import { ReactNode } from 'react'
import { IoCloseSharp } from 'react-icons/io5'

export interface ModalProps<T = any> {
  isOpen: boolean | string
  onClose?: () => void
  children?: ReactNode
  object?: T
  className?: string
  isHiddenIcon?: boolean
  title?: string
  icon?: any
  isCloseIcon?: boolean
}

export const Modal = ({ isOpen = false, onClose, children, className, isHiddenIcon, title, icon, isCloseIcon = true, ...props }: ModalProps) => {
  return isOpen === true || isOpen !== '#0' ? (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-[999] flex items-center justify-center bg-scrim px-5" {...props}>
      <div className={`flex h-fit flex-col rounded-xl border border-line bg-elevated px-4 py-3 ${className} ${!className && 'max-w-[40rem]'}`}>
        {isHiddenIcon ? (
          ''
        ) : (
          <header className="mt-1 flex w-full items-center justify-between">
            {title ? (
              <div className="flex w-full items-center gap-2">
                <p className="max-w-[28rem] overflow-hidden text-ellipsis whitespace-nowrap font-display text-h5 text-fg">{title}</p>
                <span>{icon && icon}</span>
              </div>
            ) : (
              ''
            )}

            {isCloseIcon && (
              <span onClick={onClose} className="cursor-pointer text-fg-muted transition-colors hover:text-fg">
                <IoCloseSharp size={20} />
              </span>
            )}
          </header>
        )}
        <div className="py-2">{children}</div>
      </div>
    </div>
  ) : null
}
