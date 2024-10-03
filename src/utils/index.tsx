import { AxiosError } from 'axios'
import { toast } from 'react-hot-toast'

interface ToastProps {
  toastType: string
  message: string
}

export const HandleAxiosAndGenericError = async (error: AxiosError | unknown): Promise<string> => {
  let error_message = 'Ocorreu um erro. Tente novamente mais tarde.'

  if (error instanceof AxiosError) {
    // Verifica se houve resposta do servidor
    if (error.response) {
      const statusCode = error.response.status

      switch (statusCode) {
        case 500:
          error_message = 'Erro interno do servidor. Tente novamente mais tarde.'
          break
        case 404:
          error_message = 'Recurso não encontrado.'
          break
        case 401:
          error_message = 'Não autorizado. Verifique suas credenciais.'
          break
        case 403:
          error_message = 'Não tem permissão para executar esse serviço.'
          break
        default:
          error_message = error.response.data?.message || error_message
          break
      }
    } else if (error.request) {
      // Requisição feita mas o servidor não respondeu
      error_message = 'Servidor fora do ar ou sem resposta. Tente novamente mais tarde.'
    }
  } else if (error instanceof Error) {
    error_message = error.message
  }

  return error_message
}

export const ToastifyDisplay = ({ toastType, message }: ToastProps) => {
  const notify = () => {
    switch (toastType) {
      case 'success':
        toast.success(message)
        break
      case 'warning':
        toast(message, {
          icon: '❗',
        })
        break
      case 'error':
        toast.error(message)
        break
      case 'info':
        toast(message, {
          icon: 'ℹ',
        })
        break
      case 'soon':
        toast(message, {
          icon: '🔧',
        })
        break
    }
  }

  return notify
}