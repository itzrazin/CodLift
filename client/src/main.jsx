import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import * as monaco from 'monaco-editor'
import { loader } from '@monaco-editor/react'

// Configure Monaco Editor loader to use the locally bundled monaco instance
loader.config({ monaco });


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

