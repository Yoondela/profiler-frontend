import { useEffect, useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '@/api/useApiClient';
import {
  AccountLinkingPopupCancelledError,
  authenticateLinkingProof,
  createAccountLinkingClient,
} from '@/auth/accountLinkingPopup';
import {
  advanceAccountLinkingSession,
  canStartAccountLinking,
  createAccountLinkingSession,
} from '@/auth/accountLinkingState';

const METHOD_LABELS = {
  google: 'Google',
  password: 'Email and password',
};

function methodLabel(method) {
  return METHOD_LABELS[method] || method;
}

export default function SignInMethodsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth0();
  const api = useApiClient();
  const [state, setState] = useState({ status: 'loading', data: null });
  const [actionState, setActionState] = useState({
    status: 'idle',
    error: null,
  });
  const [linkingSession, setLinkingSession] = useState(null);
  const linkingTransactionRef = useRef(null);
  const linkingEnabled =
    import.meta.env.VITE_ACCOUNT_LINKING_ENABLED === 'true';

  useEffect(() => {
    if (authLoading || !isAuthenticated) return undefined;

    let active = true;

    const loadSignInMethods = async () => {
      setState({ status: 'loading', data: null });

      try {
        const response = await api.get('/users/me/sign-in-methods');
        if (active) setState({ status: 'ready', data: response.data });
      } catch (error) {
        if (!active) return;

        const code = error.data?.code;
        const status = error.status;
        const errorStatus =
          code === 'ACCOUNT_LINKING_DISABLED'
            ? 'disabled'
            : status === 404
              ? 'not_found'
              : 'error';

        setState({ status: errorStatus, data: null });
      }
    };

    loadSignInMethods();

    return () => {
      active = false;
    };
  }, [api, authLoading, isAuthenticated]);

  if (authLoading) {
    return <main className="p-6">Loading sign-in methods…</main>;
  }

  if (!isAuthenticated) {
    return <main className="p-6">Sign in to manage your sign-in methods.</main>;
  }

  if (state.status === 'loading') {
    return <main className="p-6">Loading sign-in methods…</main>;
  }

  if (state.status === 'disabled') {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Sign-in methods
        </h1>
        <p className="mt-3 text-gray-600">
          Sign-in method management is not available yet.
        </p>
      </main>
    );
  }

  if (state.status === 'not_found') {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Sign-in methods
        </h1>
        <p className="mt-3 text-gray-600">
          Your application account is still being prepared. Please try again
          shortly.
        </p>
      </main>
    );
  }

  if (state.status === 'error' || !state.data) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Sign-in methods
        </h1>
        <p className="mt-3 text-gray-600">
          We couldn’t load your sign-in methods. Please try again later.
        </p>
      </main>
    );
  }

  const { methods, primaryMethod, availableMethods } = state.data;

  const resetLinkingSession = () => {
    linkingTransactionRef.current = null;
    setLinkingSession(null);
  };

  const linkingErrorMessage = (error) => {
    const code = error.code || error.data?.code;
    return error instanceof AccountLinkingPopupCancelledError
      ? 'Sign-in method linking was cancelled.'
      : error.message === 'LINK_EMAIL_VERIFICATION_REQUIRED'
        ? 'Verify the new email/password identity, then add it by signing in.'
        : code === 'ACCOUNT_IDENTITY_CONFLICT'
          ? 'That sign-in identity already belongs to another Exalt account.'
          : code === 'LINK_INTENT_EXPIRED'
            ? 'The linking session expired. Please start again.'
            : code === 'LINK_INTENT_ALREADY_USED'
              ? 'That linking session has already been used. Please start again.'
              : code === 'LINK_AUTHENTICATION_INVALID'
                ? 'Fresh authentication could not be verified. Please try again.'
                : 'We could not link that sign-in method. Please try again.';
  };

  const startLinking = async (secondaryMethod, secondaryMode = 'login') => {
    if (!canStartAccountLinking(actionState.status)) return;

    setActionState({ status: 'working', error: null });

    try {
      const intentResponse = await api.post('/users/me/identity-link-intents', {
        secondaryMethod,
      });
      const [primaryClient, secondaryClient] = await Promise.all([
        createAccountLinkingClient(),
        createAccountLinkingClient(),
      ]);

      linkingTransactionRef.current = {
        intentToken: intentResponse.data.intentToken,
        primaryClient,
        secondaryClient,
        primaryIdToken: null,
      };
      setLinkingSession(
        createAccountLinkingSession({ secondaryMethod, secondaryMode })
      );
      setActionState({ status: 'idle', error: null });
    } catch (error) {
      resetLinkingSession();
      setActionState({ status: 'error', error: linkingErrorMessage(error) });
    }
  };

  const verifyPrimary = async () => {
    if (
      !canStartAccountLinking(actionState.status) ||
      linkingSession?.step !== 'primary' ||
      !linkingTransactionRef.current
    ) {
      return;
    }

    setActionState({ status: 'working', error: null });

    try {
      const primaryProof = await authenticateLinkingProof({
        method: primaryMethod,
        client: linkingTransactionRef.current.primaryClient,
      });
      linkingTransactionRef.current.primaryIdToken = primaryProof.idToken;
      setLinkingSession((session) => advanceAccountLinkingSession(session));
      setActionState({ status: 'idle', error: null });
    } catch (error) {
      setActionState({ status: 'error', error: linkingErrorMessage(error) });
    }
  };

  const verifySecondaryAndLink = async () => {
    if (
      !canStartAccountLinking(actionState.status) ||
      linkingSession?.step !== 'secondary' ||
      !linkingTransactionRef.current?.primaryIdToken
    ) {
      return;
    }

    setActionState({ status: 'working', error: null });

    try {
      const secondaryProof = await authenticateLinkingProof({
        method: linkingSession.secondaryMethod,
        mode: linkingSession.secondaryMode,
        client: linkingTransactionRef.current.secondaryClient,
      });

      if (
        linkingSession.secondaryMode === 'signup' &&
        !secondaryProof.emailVerified
      ) {
        throw new Error('LINK_EMAIL_VERIFICATION_REQUIRED');
      }

      const linkResponse = await api.post('/users/me/identity-links', {
        intentToken: linkingTransactionRef.current.intentToken,
        primaryIdToken: linkingTransactionRef.current.primaryIdToken,
        secondaryIdToken: secondaryProof.idToken,
      });

      setState({ status: 'ready', data: linkResponse.data });
      resetLinkingSession();
      setActionState({ status: 'success', error: null });
    } catch (error) {
      const code = error.code || error.data?.code;
      if (code === 'ACCOUNT_LINKING_UNAVAILABLE') {
        try {
          const refreshed = await api.get('/users/me/sign-in-methods');
          const linked = refreshed.data.methods?.some(
            ({ method }) => method === linkingSession.secondaryMethod
          );
          if (linked) {
            setState({ status: 'ready', data: refreshed.data });
            resetLinkingSession();
            setActionState({ status: 'success', error: null });
            return;
          }
        } catch {
          // Preserve the original linking failure when reconciliation fails.
        }
      }

      if (
        code === 'ACCOUNT_LINKING_UNAVAILABLE' ||
        code === 'LINK_INTENT_EXPIRED' ||
        code === 'LINK_INTENT_ALREADY_USED' ||
        code === 'LINK_AUTHENTICATION_INVALID' ||
        error.message === 'LINK_EMAIL_VERIFICATION_REQUIRED'
      ) {
        resetLinkingSession();
      }
      setActionState({ status: 'error', error: linkingErrorMessage(error) });
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Sign-in methods</h1>
      <p className="mt-2 text-gray-600">
        These methods can be used to access your Exalt account.
      </p>

      <section className="mt-6 space-y-3" aria-labelledby="connected-methods">
        <h2
          id="connected-methods"
          className="text-lg font-medium text-gray-900"
        >
          Connected methods
        </h2>
        {methods.map(({ method, primary }) => (
          <div
            key={method}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4"
          >
            <div>
              <p className="font-medium text-gray-900">{methodLabel(method)}</p>
              <p className="text-sm text-gray-600">
                {primary || method === primaryMethod
                  ? 'Primary method'
                  : 'Connected'}
              </p>
            </div>
            <span className="rounded-full bg-green-50 px-3 py-1 text-sm text-green-700">
              Connected
            </span>
          </div>
        ))}
      </section>

      <section className="mt-8" aria-labelledby="available-methods">
        <h2
          id="available-methods"
          className="text-lg font-medium text-gray-900"
        >
          Available to add
        </h2>
        {!linkingEnabled ? (
          <p className="mt-3 text-sm text-gray-600">
            Adding sign-in methods is not enabled in this environment.
          </p>
        ) : availableMethods.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">
            All supported sign-in methods are connected.
          </p>
        ) : linkingSession ? (
          <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-gray-700">
              {linkingSession.step === 'primary'
                ? `First, verify your current ${methodLabel(primaryMethod)} sign-in.`
                : `Now verify the ${methodLabel(linkingSession.secondaryMethod)} sign-in you want to add.`}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={actionState.status === 'working'}
                onClick={
                  linkingSession.step === 'primary'
                    ? verifyPrimary
                    : verifySecondaryAndLink
                }
              >
                {actionState.status === 'working'
                  ? 'Verifying…'
                  : linkingSession.step === 'primary'
                    ? `Verify ${methodLabel(primaryMethod)}`
                    : `Verify ${methodLabel(linkingSession.secondaryMethod)}`}
              </button>
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={actionState.status === 'working'}
                onClick={() => {
                  resetLinkingSession();
                  setActionState({ status: 'idle', error: null });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <ul className="mt-3 space-y-3 text-sm text-gray-600">
            {availableMethods.map((method) => (
              <li key={method} className="flex flex-wrap items-center gap-3">
                <span>{methodLabel(method)}</span>
                <button
                  type="button"
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={actionState.status === 'working'}
                  onClick={() => startLinking(method)}
                >
                  {actionState.status === 'working'
                    ? 'Verifying…'
                    : `Add ${methodLabel(method)}`}
                </button>
                {method === 'password' && primaryMethod === 'google' && (
                  <button
                    type="button"
                    className="rounded-md border border-blue-600 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={actionState.status === 'working'}
                    onClick={() => startLinking(method, 'signup')}
                  >
                    Create password sign-in
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        {actionState.error && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {actionState.error}
          </p>
        )}
        {actionState.status === 'success' && (
          <p className="mt-4 text-sm text-green-700" role="status">
            Sign-in method linked successfully.
          </p>
        )}
      </section>
    </main>
  );
}
