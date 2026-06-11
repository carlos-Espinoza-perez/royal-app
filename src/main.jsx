import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { MockDataProvider } from './contexts/MockDataContext.jsx'
import { ToastProvider } from './contexts/ToastContext.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <MockDataProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </MockDataProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
