import assert from 'node:assert/strict';
import test from 'node:test';
import {
  advanceAccountLinkingSession,
  canStartAccountLinking,
  createAccountLinkingSession,
} from './accountLinkingState.js';

test('allows a retry after an error or cancellation', () => {
  assert.equal(canStartAccountLinking('error'), true);
  assert.equal(canStartAccountLinking('idle'), true);
  assert.equal(canStartAccountLinking('success'), true);
});

test('prevents a duplicate attempt while linking is in progress', () => {
  assert.equal(canStartAccountLinking('working'), false);
});

test('requires primary verification before secondary verification', () => {
  const session = createAccountLinkingSession({
    secondaryMethod: 'password',
    secondaryMode: 'signup',
  });

  assert.deepEqual(session, {
    secondaryMethod: 'password',
    secondaryMode: 'signup',
    step: 'primary',
  });
  assert.deepEqual(advanceAccountLinkingSession(session), {
    ...session,
    step: 'secondary',
  });
});
