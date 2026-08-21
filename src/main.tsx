import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './lib/pwa';
import { seedOfflineKnowledgeBaseIfEmpty, getUserSettings } from './lib/storage';

// Initialize Service Worker for PWA and Offline Support
registerServiceWorker();

// Initialize local offline database and settings
getUserSettings().catch(console.error);
seedOfflineKnowledgeBaseIfEmpty().catch(console.error);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

