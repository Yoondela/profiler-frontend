// src/auth/Auth0ProviderWithRedirect.jsx
import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export default function Auth0ProviderWithRedirect({ children }) {
  const navigate = useNavigate();

  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  console.log('AUTH0 DOMAIN:', import.meta.env.VITE_AUTH0_DOMAIN);
  console.log('AUTH0 CALLBACK:', import.meta.env.VITE_AUTH0_CALLBACK_URL);

  // When Auth0 redirects back after login:
  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || '/', { replace: true });
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/callback`,
        audience,
      }}
      useRefreshTokens={false}
      cacheLocation="localstorage"
      onRedirectCallback={onRedirectCallback}
      skipRedirectCallback={false}
    >
      {children}
    </Auth0Provider>
  );
}
