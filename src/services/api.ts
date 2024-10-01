import axios from 'axios'

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

export { quizUserAPI, quizAdminAPI }
