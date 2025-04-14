
import { createRoot } from 'react-dom/client';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import App from './App.tsx';
import './index.css';

// PWA Elements से कस्टम एलिमेंट्स को रजिस्टर करें
defineCustomElements(window);

// ऐप रूट इनिशियलाइज़ करें
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  const root = createRoot(container!);
  root.render(<App />);
});
