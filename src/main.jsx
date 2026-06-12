import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { SupabaseDataProvider } from './contexts/SupabaseDataContext.jsx'
import { ToastProvider } from './contexts/ToastContext.jsx'
import { ConfirmProvider } from './contexts/ConfirmContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SupabaseDataProvider>
            <ToastProvider>
              <ConfirmProvider>
                <App />
              </ConfirmProvider>
            </ToastProvider>
          </SupabaseDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
