import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '@/api/useApiClient';
import SignInMethodsPage from './SignInMethodsPage';

const STATUS_STYLES = {
  verified: 'bg-green-50 text-green-700',
  unverified: 'bg-amber-50 text-amber-700',
  unknown: 'bg-gray-100 text-gray-700',
  not_provided: 'bg-gray-100 text-gray-700',
};

function statusLabel(status) {
  return status === 'not_provided'
    ? 'Not provided'
    : status.charAt(0).toUpperCase() + status.slice(1);
}

function VerificationRow({ label, detail, status, checkedAt }) {
  const checkedDetail = checkedAt
    ? `Last checked ${new Date(checkedAt).toLocaleDateString()}`
    : null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">{detail || 'Not provided'}</p>
        {checkedDetail && (
          <p className="mt-1 text-xs text-gray-500">{checkedDetail}</p>
        )}
      </div>
      <span
        className={`rounded-full px-3 py-1 text-sm ${STATUS_STYLES[status] || STATUS_STYLES.unknown}`}
      >
        {statusLabel(status)}
      </span>
    </div>
  );
}

export default function AccountPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth0();
  const api = useApiClient();
  const [verification, setVerification] = useState({
    status: 'loading',
    data: null,
  });
  const [emailAction, setEmailAction] = useState({
    status: 'idle',
    error: null,
  });
  const [emailResendSeconds, setEmailResendSeconds] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneAction, setPhoneAction] = useState({
    status: 'idle',
    error: null,
  });

  useEffect(() => {
    if (authLoading || !isAuthenticated) return undefined;

    let active = true;
    const loadVerification = async () => {
      try {
        const response = await api.get('/users/me/account-verification');
        if (active) setVerification({ status: 'ready', data: response.data });
      } catch {
        if (active) setVerification({ status: 'error', data: null });
      }
    };

    loadVerification();
    return () => {
      active = false;
    };
  }, [api, authLoading, isAuthenticated]);

  useEffect(() => {
    if (emailResendSeconds === 0) return undefined;

    const timeout = window.setTimeout(() => {
      setEmailResendSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [emailResendSeconds]);

  if (authLoading) {
    return <main className="p-6">Loading account…</main>;
  }

  if (!isAuthenticated) {
    return <main className="p-6">Sign in to manage your account.</main>;
  }

  const requestEmailVerification = async () => {
    setEmailAction({ status: 'sending', error: null });

    try {
      await api.post('/users/me/account-verification/email/resend');
      setEmailAction({ status: 'sent', error: null });
      setEmailResendSeconds(30);
    } catch (error) {
      if (error.data?.code === 'EMAIL_ALREADY_VERIFIED') {
        try {
          const response = await api.get('/users/me/account-verification');
          setVerification({ status: 'ready', data: response.data });
          setEmailAction({ status: 'idle', error: null });
          return;
        } catch {
          // Keep the verification resend error visible when the refresh fails.
        }
      }

      setEmailAction({
        status: 'error',
        error:
          error.data?.message ||
          'We couldn’t send a verification email. Please try again later.',
      });
    }
  };

  const savePhoneNumber = async (event) => {
    event.preventDefault();
    setPhoneAction({ status: 'saving', error: null });

    try {
      const response = await api.put('/users/me/account-verification/phone', {
        phoneNumber,
      });
      setVerification((current) => ({
        status: 'ready',
        data: {
          ...current.data,
          phone: response.data.phone,
        },
      }));
      setPhoneAction({ status: 'saved', error: null });
    } catch (error) {
      setPhoneAction({
        status: 'error',
        error:
          error.data?.message ||
          'We couldn’t save your cell number. Please try again later.',
      });
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Account</h1>
      <p className="mt-2 text-gray-600">
        Review your verification status and sign-in methods.
      </p>

      <section
        className="mt-6 space-y-3"
        aria-labelledby="account-verification"
      >
        <h2
          id="account-verification"
          className="text-lg font-medium text-gray-900"
        >
          Account verification
        </h2>
        {verification.status === 'loading' && (
          <p className="text-sm text-gray-600">Loading verification status…</p>
        )}
        {verification.status === 'error' && (
          <p className="text-sm text-red-600" role="alert">
            We couldn’t load your verification status. Please try again later.
          </p>
        )}
        {verification.status === 'ready' && verification.data && (
          <>
            <VerificationRow
              label="Email"
              detail={verification.data.email?.value}
              status={verification.data.email?.status || 'unknown'}
              checkedAt={verification.data.email?.checkedAt}
            />
            {verification.data.email?.status === 'unverified' && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-amber-900">
                  Verify this email address to confirm you can receive account
                  messages.
                </p>
                <button
                  type="button"
                  className="mt-3 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={
                    emailAction.status === 'sending' || emailResendSeconds > 0
                  }
                  onClick={requestEmailVerification}
                >
                  {emailAction.status === 'sending'
                    ? 'Sending…'
                    : emailResendSeconds > 0
                      ? `Resend email (${emailResendSeconds}s)`
                    : emailAction.status === 'sent'
                      ? 'Resend email'
                      : 'Verify email'}
                </button>
                {emailAction.status === 'sent' && (
                  <p className="mt-3 text-sm text-green-700" role="status">
                    Verification email sent. Open the link, then sign in again
                    to refresh your status.
                  </p>
                )}
                {emailAction.status === 'error' && (
                  <p className="mt-3 text-sm text-red-600" role="alert">
                    {emailAction.error}
                  </p>
                )}
              </div>
            )}
            <VerificationRow
              label="Cell number"
              detail={verification.data.phone?.value}
              status={verification.data.phone?.status || 'not_provided'}
            />
            {(verification.data.phone?.status || 'not_provided') ===
              'not_provided' && (
              <form
                className="rounded-lg border border-gray-200 bg-white p-4"
                onSubmit={savePhoneNumber}
              >
                <label
                  htmlFor="account-phone-number"
                  className="block text-sm font-medium text-gray-900"
                >
                  Cell number
                </label>
                <p className="mt-1 text-sm text-gray-600">
                  Use a South African mobile number. We’ll save it before
                  asking you to verify it.
                </p>
                <input
                  id="account-phone-number"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
                  placeholder="+27 72 123 4567"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="mt-3 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={phoneAction.status === 'saving'}
                >
                  {phoneAction.status === 'saving'
                    ? 'Saving…'
                    : 'Save phone number'}
                </button>
                {phoneAction.status === 'error' && (
                  <p className="mt-3 text-sm text-red-600" role="alert">
                    {phoneAction.error}
                  </p>
                )}
              </form>
            )}
            {phoneAction.status === 'saved' && (
              <p className="text-sm text-green-700" role="status">
                Phone number saved. Phone verification will be available in a
                later step.
              </p>
            )}
            <VerificationRow
              label="Physical address"
              detail={verification.data.address?.value}
              status={verification.data.address?.status || 'not_provided'}
            />
          </>
        )}
      </section>

      <SignInMethodsPage embedded />
    </main>
  );
}
