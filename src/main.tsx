import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { installBlockTextures } from './components/World/textures'

// Block textures are drawn once and exposed as CSS variables before first paint.
installBlockTextures()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
