import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { loadBrainSettings } from './services/BrainSettingsService'

async function initDatabase() {
  try {
    const SQLiteModule = await import('wa-sqlite/dist/wa-sqlite.mjs') as any
    const SQLiteFactory = SQLiteModule.default as (config?: object) => Promise<any>
    const SQLite = await import('wa-sqlite')
    const { initSQLite } = await import('./lib/sqlite')
    const module = await SQLiteFactory()
    const sqlite3 = SQLite.Factory(module)
    const db = await sqlite3.open_v2(':memory:')
    await initSQLite(db)
    await sqlite3.close(db)
    if (import.meta.env.DEV) console.log('[Main] SQLite schema applied')
  } catch (err) {
    console.error('[Main] Failed to initialise SQLite', err)
  }
}

// Suppress console.log statements in production builds
if (import.meta.env.PROD) {
  console.log = () => {};
}

if (import.meta.env.DEV) console.log('[Main] Starting React application...');
if (import.meta.env.DEV) console.log('[Main] Environment variables:', {
  NODE_ENV: import.meta.env.NODE_ENV,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY ? 'Present' : 'Missing',
  VITE_ELEVENLABS_API_KEY: import.meta.env.VITE_ELEVENLABS_API_KEY ? 'Present' : 'Missing'
});

// Add error handling for script loading
window.addEventListener('error', (event) => {
  console.error('[Main] Global error caught:', event);
  console.error('[Main] Error type:', event.type);
  console.error('[Main] Error message:', event.message);
  console.error('[Main] Error filename:', event.filename);
  console.error('[Main] Error lineno:', event.lineno);
  console.error('[Main] Error colno:', event.colno);
  console.error('[Main] Error source:', event.target);
  
  if (event.target && event.target.tagName) {
    console.error('[Main] Failed element tag:', event.target.tagName);
    console.error('[Main] Failed element src/href:', event.target.src || event.target.href);
  }
});

// Add unhandled promise rejection handling
window.addEventListener('unhandledrejection', (event) => {
  console.error('[Main] Unhandled promise rejection:', event);
  console.error('[Main] Rejection reason:', event.reason);
});

async function start() {
  try {
    await initDatabase()
    await loadBrainSettings()
    if (import.meta.env.DEV) console.log('[Main] Creating React root...')
    const root = ReactDOM.createRoot(document.getElementById('root')!)
    if (import.meta.env.DEV) console.log('[Main] Root created successfully')

    if (import.meta.env.DEV) console.log('[Main] Rendering App component...')
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
    if (import.meta.env.DEV) console.log('[Main] App component rendered successfully')
  } catch (error) {
    console.error('[Main] Error during React initialization:', error)
  }
}

start()
