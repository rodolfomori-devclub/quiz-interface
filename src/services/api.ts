import axios, { AxiosError, AxiosInstance } from 'axios'
import { STORAGE_KEYS } from '../config/quiz'

const quizUserAPI = axios.create({
  baseURL: import.meta.env.VITE_USER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const quizAdminAPI = axios.create({
  baseURL: import.meta.env.VITE_USER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Sem isto o token expirado deixa a pessoa presa: as rotas ainda enxergam o token
// no localStorage e liberam a área privada, mas toda chamada volta 401 e recarregar
// cai no mesmo lugar. Limpar a sessão devolve ela pro formulário.
// ponytail: redireciono com window.location em vez de plugar o router aqui - o
// interceptor vive fora do React. Se um dia precisar preservar rota de origem, aí sim.
function logoutOn401(api: AxiosInstance, keys: string[]) {
  api.interceptors.response.use(undefined, (error: AxiosError) => {
    if (error.response?.status === 401) {
      keys.forEach((key) => localStorage.removeItem(key))
      delete api.defaults.headers.common['Authorization']
      // Atraso para o toast de "sessão expirou" ser lido antes de sair da página.
      setTimeout(() => {
        window.location.href = '/'
      }, 2500)
    }

    return Promise.reject(error)
  })
}

logoutOn401(quizUserAPI, [STORAGE_KEYS.accessToken, STORAGE_KEYS.user])
logoutOn401(quizAdminAPI, [STORAGE_KEYS.adminAccessToken, STORAGE_KEYS.admin])

export { quizUserAPI, quizAdminAPI }
