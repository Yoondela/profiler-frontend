import { createAuth0Client } from '@auth0/auth0-spa-js';

const METHOD_CONNECTIONS = {
  google: 'google-oauth2',
  password: 'Username-Password-Authentication',
};

class AccountLinkingPopupError extends Error {
  constructor(message = 'Unable to authenticate the sign-in method.') {
    super(message);
    this.name = 'AccountLinkingPopupError';
    this.code = 'LINK_POPUP_FAILED';
  }
}

class AccountLinkingPopupCancelledError extends AccountLinkingPopupError {
  constructor() {
    super('Sign-in method authentication was cancelled.');
    this.name = 'AccountLinkingPopupCancelledError';
    this.code = 'LINK_POPUP_CANCELLED';
  }
}

function getRuntimeConfig(environment = import.meta.env) {
  const config = {
    domain: environment.VITE_AUTH0_DOMAIN,
    clientId: environment.VITE_AUTH0_CLIENT_ID,
  };

  if (!config.domain || !config.clientId) {
    throw new AccountLinkingPopupError(
      'Auth0 popup configuration is unavailable.'
    );
  }

  return config;
}

function isPopupCancellation(error) {
  return (
    error?.error === 'popup_closed' ||
    error?.code === 'popup_closed' ||
    error?.error === 'cancelled' ||
    error?.code === 'cancelled'
  );
}

async function authenticateLinkingProof({ method, mode = 'login', client }) {
  const connection = METHOD_CONNECTIONS[method];
  if (!connection || !client || (mode === 'signup' && method !== 'password')) {
    throw new AccountLinkingPopupError('Unsupported sign-in method.');
  }

  try {
    await client.loginWithPopup({
      authorizationParams: {
        connection,
        prompt: 'login',
        max_age: 0,
        scope: 'openid profile email',
        redirect_uri: `${window.location.origin}/callback`,
        ...(mode === 'signup' ? { screen_hint: 'signup' } : {}),
      },
    });

    const claims = await client.getIdTokenClaims();
    const idToken = claims?.__raw;
    if (!idToken || !claims?.sub) {
      throw new AccountLinkingPopupError(
        'Auth0 did not return a usable identity proof.'
      );
    }

    return {
      idToken,
      connection,
      sub: claims.sub,
      email: claims.email,
      emailVerified: claims.email_verified === true,
    };
  } catch (error) {
    if (error instanceof AccountLinkingPopupError) throw error;
    if (isPopupCancellation(error)) {
      throw new AccountLinkingPopupCancelledError();
    }
    throw new AccountLinkingPopupError();
  }
}

async function createAccountLinkingClient({
  createClient = createAuth0Client,
  environment,
} = {}) {
  try {
    return await createClient({
      ...getRuntimeConfig(environment),
      cacheLocation: 'memory',
      useRefreshTokens: false,
    });
  } catch {
    throw new AccountLinkingPopupError();
  }
}

export {
  AccountLinkingPopupCancelledError,
  AccountLinkingPopupError,
  METHOD_CONNECTIONS,
  authenticateLinkingProof,
  createAccountLinkingClient,
  isPopupCancellation,
};
