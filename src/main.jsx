import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { UserAuthProvider } from './contexts/user-auth.context.jsx'
import '@fontsource/poppins'

createRoot(document.getElementById('root')).render(
  <UserAuthProvider>
  <BrowserRouter>
  <StrictMode>
    <App />
  </StrictMode>
  </BrowserRouter>
  </UserAuthProvider>,
)
