import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { UserAuthProvider } from './contexts/user-auth.context.jsx'
import { HelperProvider } from './contexts/helper.context.jsx'
import { ToastProvider } from './contexts/toast.context.jsx'
import { DbDataProvider } from './contexts/dbdata.context.jsx'
import '@fontsource/poppins'

createRoot(document.getElementById('root')).render(
  <UserAuthProvider>
  <BrowserRouter>
  <DbDataProvider>
  <HelperProvider>
  <ToastProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </ToastProvider>
  </HelperProvider>
  </DbDataProvider>
  </BrowserRouter>
  </UserAuthProvider>,
)
