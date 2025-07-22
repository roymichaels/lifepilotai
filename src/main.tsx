import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Suppress console.log statements in production builds
if (import.meta.env.PROD) {
  console.log = () => {};
}

console.log('[Main] Starting React application...');
console.log('[Main] Environment variables:', {
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

try {
  console.log('[Main] Creating React root...');
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  console.log('[Main] Root created successfully');
  
  console.log('[Main] Rendering App component...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  console.log('[Main] App component rendered successfully');
} catch (error) {
  console.error('[Main] Error during React initialization:', error);
}