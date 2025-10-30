// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Auth0ProviderWithRedirect from './auth/Auth0ProviderWithRedirect.jsx';
import App from './App.jsx';

import './assets/styles/tailwind.css';
import './assets/styles/main.scss';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Auth0ProviderWithRedirect>
          <App />
        </Auth0ProviderWithRedirect>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
