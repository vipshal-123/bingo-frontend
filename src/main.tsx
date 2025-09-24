import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { SocketProvider } from './contexts/SocketContext.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <SocketProvider>
                <App />
            </SocketProvider>
        </BrowserRouter>
    </StrictMode>,
)
