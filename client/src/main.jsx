import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App.jsx';
import './apiBase.js';
import './index.css';

// Register service worker — auto-update silently in background
registerSW({
  onNeedRefresh() {
    // New version available — reload automatically (no prompt needed for this app)
    window.location.reload();
  },
  onOfflineReady() {
    console.log('কারিগরি অফলাইনে কাজ করতে প্রস্তুত');
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
