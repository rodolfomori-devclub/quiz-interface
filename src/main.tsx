import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'

import { Starfield } from '@devclub/brand'

import { Routes } from './routes'
import { UserProvider } from './hooks/user'

import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <Starfield />
      <div style={{ position: 'relative' }}>
        <Toaster
          toastOptions={{
            duration: 3000,
            position: 'bottom-right',
          }}
        />
        <Routes />
      </div>
    </UserProvider>
  </StrictMode>,
)
