import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App.jsx';
import './apiBase.js';
import './index.css';

// Register service worker — auto-update silently
registerSW({
  onNeedRefresh() { window.location.reload(); },
  onOfflineReady() { /* ready */ },
});

const root = document.getElementById('root');

// StrictMode in dev only — production avoids double-render overhead
if (import.meta.env.DEV) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(root).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
