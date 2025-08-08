import axios from 'axios'

const quizUserAPI = axios.create({
  baseURL: import.meta.env.VITE_USER_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-new-certificate': 'true',
  },
})

const quizAdminAPI = axios.create({
  baseURL: import.meta.env.VITE_USER_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-new-certificate': 'true',
  },
})

export { quizAdminAPI, quizUserAPI }

