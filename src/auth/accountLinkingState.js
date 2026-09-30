function canStartAccountLinking(status) {
  return status !== 'working';
}

function createAccountLinkingSession({ secondaryMethod, secondaryMode }) {
  return {
    secondaryMethod,
    secondaryMode,
    step: 'primary',
  };
}

function advanceAccountLinkingSession(session) {
  if (session?.step !== 'primary') return session;
  return { ...session, step: 'secondary' };
}

export {
  advanceAccountLinkingSession,
  canStartAccountLinking,
  createAccountLinkingSession,
};
