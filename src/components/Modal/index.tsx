import { ReactNode } from 'react'
import { IoCloseSharp } from 'react-icons/io5'

export interface ModalProps<T = any> {
  isOpen: boolean
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
  return isOpen ? (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-[999] flex items-center justify-center bg-black bg-opacity-85 max-md:px-5" {...props}>
      <div className={`flex h-fit flex-col rounded-md bg-white px-4 py-2 ${className} ${!className && 'max-w-[40rem]'}`}>
        {isHiddenIcon ? (
          ''
        ) : (
          <header className="mt-2 flex w-full items-center justify-between">
            {title ? (
              <div className="flex w-full items-center gap-2">
                <p className="max-w-[28rem] overflow-hidden text-ellipsis whitespace-nowrap font-sans text-base font-semibold text-zinc-800">{title}</p>
                <span>{icon && icon}</span>
              </div>
            ) : (
              ''
            )}

            {isCloseIcon && (
              <span onClick={onClose} className="cursor-pointer hover:opacity-80">
                <IoCloseSharp size={20} className="text-zinc-400" />
              </span>
            )}
          </header>
        )}
        <div className="py-2">{children}</div>
      </div>
    </div>
  ) : null
}
