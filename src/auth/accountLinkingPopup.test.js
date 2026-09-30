import assert from 'node:assert/strict';
import test from 'node:test';
import {
  AccountLinkingPopupCancelledError,
  AccountLinkingPopupError,
  authenticateLinkingProof,
  createAccountLinkingClient,
  isPopupCancellation,
} from './accountLinkingPopup.js';

globalThis.window = { location: { origin: 'http://localhost:5173' } };

const environment = {
  VITE_AUTH0_DOMAIN: 'example.us.auth0.com',
  VITE_AUTH0_CLIENT_ID: 'spa-client-id',
};

test('prepares an isolated memory-only client', async () => {
  let clientOptions;
  const client = { prepared: true };
  const result = await createAccountLinkingClient({
    environment,
    createClient: async (options) => {
      clientOptions = options;
      return client;
    },
  });

  assert.equal(result, client);
  assert.equal(clientOptions.cacheLocation, 'memory');
  assert.equal(clientOptions.useRefreshTokens, false);
});

test('opens the prepared client synchronously and returns the ID-token proof', async () => {
  let popupOptions;
  let popupStarted = false;
  const client = {
    loginWithPopup: async (options) => {
      popupStarted = true;
      popupOptions = options;
    },
    getIdTokenClaims: async () => ({
      __raw: 'id-token',
      sub: 'google-oauth2|user',
      email: 'person@example.com',
      email_verified: true,
    }),
  };

  const proofPromise = authenticateLinkingProof({
    method: 'google',
    client,
  });
  assert.equal(popupStarted, true);
  const proof = await proofPromise;

  assert.deepEqual(popupOptions.authorizationParams, {
    connection: 'google-oauth2',
    prompt: 'login',
    max_age: 0,
    scope: 'openid profile email',
    redirect_uri: 'http://localhost:5173/callback',
  });
  assert.deepEqual(proof, {
    idToken: 'id-token',
    connection: 'google-oauth2',
    sub: 'google-oauth2|user',
    email: 'person@example.com',
    emailVerified: true,
  });
});

test('opens Auth0 database signup when password creation is requested', async () => {
  let popupOptions;

  await authenticateLinkingProof({
    method: 'password',
    mode: 'signup',
    client: {
      loginWithPopup: async (options) => {
        popupOptions = options;
      },
      getIdTokenClaims: async () => ({
        __raw: 'database-id-token',
        sub: 'auth0|new-user',
        email: 'person@example.com',
        email_verified: true,
      }),
    },
  });

  assert.equal(
    popupOptions.authorizationParams.redirect_uri,
    'http://localhost:5173/callback'
  );
  assert.equal(popupOptions.authorizationParams.screen_hint, 'signup');
});

test('normalizes popup cancellation without exposing the SDK error', async () => {
  await assert.rejects(
    authenticateLinkingProof({
      method: 'password',
      client: {
        loginWithPopup: async () => {
          throw { error: 'popup_closed' };
        },
      },
    }),
    (error) => {
      assert.ok(error instanceof AccountLinkingPopupCancelledError);
      assert.equal(error.code, 'LINK_POPUP_CANCELLED');
      return true;
    }
  );
});

test('normalizes popup failures and rejects unsupported methods', async () => {
  await assert.rejects(
    authenticateLinkingProof({
      method: 'google',
      client: {
        loginWithPopup: async () => {
          throw new Error('popup failed');
        },
      },
    }),
    (error) => {
      assert.ok(error instanceof AccountLinkingPopupError);
      assert.equal(error.code, 'LINK_POPUP_FAILED');
      assert.equal(error.message, 'Unable to authenticate the sign-in method.');
      return true;
    }
  );

  await assert.rejects(
    createAccountLinkingClient({
      environment,
      createClient: async () => {
        throw new Error('client creation failed');
      },
    }),
    (error) => error.code === 'LINK_POPUP_FAILED'
  );

  await assert.rejects(
    authenticateLinkingProof({ method: 'github', client: {} }),
    (error) => error.code === 'LINK_POPUP_FAILED'
  );
});

test('recognizes Auth0 popup cancellation codes', () => {
  assert.equal(isPopupCancellation({ error: 'popup_closed' }), true);
  assert.equal(isPopupCancellation({ code: 'cancelled' }), true);
  assert.equal(isPopupCancellation({ error: 'other' }), false);
});
