import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Browsers do not support WebCrypto API for ed255519 key generation
// This provides support for it
import { install } from '@solana/webcrypto-ed25519-polyfill';
install(); // patches WebCrypto for Ed25519 support

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
