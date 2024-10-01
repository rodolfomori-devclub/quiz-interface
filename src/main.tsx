import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'

import { Routes } from './routes'
import { UserProvider } from './hooks/user'

import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <Toaster
        toastOptions={{
          style: {},
          duration: 3000,
          position: 'bottom-right',
        }}
      />
      <Routes />
    </UserProvider>
  </StrictMode>,
)
