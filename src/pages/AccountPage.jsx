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
  const [emailResendAvailableAt, setEmailResendAvailableAt] = useState(null);
  const [emailResendSeconds, setEmailResendSeconds] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneAction, setPhoneAction] = useState({
    status: 'idle',
    error: null,
  });
  const [phoneVerificationAction, setPhoneVerificationAction] = useState({
    status: 'idle',
    error: null,
  });
  const [phoneCodeEntryVisible, setPhoneCodeEntryVisible] = useState(false);
  const [phoneVerificationCode, setPhoneVerificationCode] = useState('');
  const [phoneCodeAction, setPhoneCodeAction] = useState({
    status: 'idle',
    error: null,
  });
  const [phoneResendAvailableAt, setPhoneResendAvailableAt] = useState(null);
  const [phoneResendSeconds, setPhoneResendSeconds] = useState(0);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return undefined;

    let active = true;
    const loadVerification = async () => {
      try {
        const response = await api.get('/users/me/account-verification');
        if (active) {
          setVerification({ status: 'ready', data: response.data });
          setEmailResendAvailableAt(
            response.data.email?.resendAvailableAt || null
          );
          setPhoneResendAvailableAt(
            response.data.phone?.resendAvailableAt || null,
          );
          setPhoneCodeEntryVisible(
            Boolean(response.data.phone?.resendAvailableAt)
          );
        }
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
    if (!emailResendAvailableAt) {
      setEmailResendSeconds(0);
      return undefined;
    }

    let timeout;
    const updateCountdown = () => {
      const seconds = Math.max(
        Math.ceil(
          (new Date(emailResendAvailableAt).getTime() - Date.now()) / 1000
        ),
        0
      );
      setEmailResendSeconds(seconds);
      if (seconds > 0) timeout = window.setTimeout(updateCountdown, 1000);
    };

    updateCountdown();

    return () => window.clearTimeout(timeout);
  }, [emailResendAvailableAt]);

  useEffect(() => {
    if (!phoneResendAvailableAt) {
      setPhoneResendSeconds(0);
      return undefined;
    }

    let timeout;
    const updateCountdown = () => {
      const seconds = Math.max(
        Math.ceil(
          (new Date(phoneResendAvailableAt).getTime() - Date.now()) / 1000,
        ),
        0,
      );
      setPhoneResendSeconds(seconds);
      if (seconds > 0) timeout = window.setTimeout(updateCountdown, 1000);
    };

    updateCountdown();

    return () => window.clearTimeout(timeout);
  }, [phoneResendAvailableAt]);

  if (authLoading) {
    return <main className="p-6">Loading account…</main>;
  }

  if (!isAuthenticated) {
    return <main className="p-6">Sign in to manage your account.</main>;
  }

  const requestEmailVerification = async () => {
    setEmailAction({ status: 'sending', error: null });

    try {
      const response = await api.post(
        '/users/me/account-verification/email/resend'
      );
      setEmailAction({ status: 'sent', error: null });
      setEmailResendAvailableAt(response.data.resendAvailableAt);
    } catch (error) {
      if (error.data?.code === 'EMAIL_VERIFICATION_RESEND_PENDING') {
        setEmailAction({ status: 'idle', error: null });
        setEmailResendAvailableAt(error.data.resendAvailableAt);
        return;
      }

      if (error.data?.code === 'EMAIL_ALREADY_VERIFIED') {
        try {
          const response = await api.get('/users/me/account-verification');
          setVerification({ status: 'ready', data: response.data });
          setEmailResendAvailableAt(
            response.data.email?.resendAvailableAt || null
          );
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

  const requestPhoneVerification = async () => {
    setPhoneVerificationAction({ status: 'sending', error: null });

    try {
      const response = await api.post(
        '/users/me/account-verification/phone/start',
      );
      setPhoneVerificationAction({ status: 'sent', error: null });
      setPhoneCodeEntryVisible(true);
      setPhoneResendAvailableAt(response.data.resendAvailableAt);
    } catch (error) {
      if (error.data?.code === 'PHONE_VERIFICATION_RESEND_PENDING') {
        setPhoneVerificationAction((current) => ({
          status: current.status === 'sent' ? 'sent' : 'idle',
          error: null,
        }));
        setPhoneResendAvailableAt(error.data.resendAvailableAt);
        return;
      }

      if (error.data?.code === 'PHONE_ALREADY_VERIFIED') {
        try {
          const response = await api.get('/users/me/account-verification');
          setVerification({ status: 'ready', data: response.data });
          setPhoneResendAvailableAt(
            response.data.phone?.resendAvailableAt || null,
          );
          setPhoneVerificationAction({ status: 'idle', error: null });
          return;
        } catch {
          // Keep the phone verification error visible when the refresh fails.
        }
      }

      setPhoneVerificationAction({
        status: 'error',
        error:
          error.data?.message ||
          'We couldn’t send a verification code. Please try again later.',
      });
    }
  };

  const checkPhoneVerificationCode = async (event) => {
    event.preventDefault();
    setPhoneCodeAction({ status: 'checking', error: null });

    try {
      await api.post('/users/me/account-verification/phone/check', {
        code: phoneVerificationCode,
      });
      setVerification((current) => ({
        status: 'ready',
        data: {
          ...current.data,
          phone: { ...current.data.phone, status: 'verified' },
        },
      }));
      setPhoneCodeEntryVisible(false);
      setPhoneVerificationCode('');
      setPhoneCodeAction({ status: 'verified', error: null });
    } catch (error) {
      if (error.data?.code === 'PHONE_ALREADY_VERIFIED') {
        try {
          const response = await api.get('/users/me/account-verification');
          setVerification({ status: 'ready', data: response.data });
          setPhoneResendAvailableAt(
            response.data.phone?.resendAvailableAt || null
          );
          setPhoneCodeEntryVisible(false);
          setPhoneCodeAction({ status: 'verified', error: null });
          return;
        } catch {
          // Keep the code-check error visible when the status refresh fails.
        }
      }

      setPhoneCodeAction({
        status: 'error',
        error:
          error.data?.message ||
          'We couldn’t verify this cell number. Please try again later.',
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
            {phoneCodeAction.status === 'verified' && (
              <p className="text-sm text-green-700" role="status">
                Cell number verified.
              </p>
            )}
            {verification.data.phone?.status === 'unverified' && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-amber-900">
                  We’ll send a verification code to this cell number.
                </p>
                <button
                  type="button"
                  className="mt-3 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={
                    phoneVerificationAction.status === 'sending' ||
                    phoneResendSeconds > 0
                  }
                  onClick={requestPhoneVerification}
                >
                  {phoneVerificationAction.status === 'sending'
                    ? 'Sending…'
                    : phoneResendSeconds > 0
                      ? `Resend code (${phoneResendSeconds}s)`
                      : phoneVerificationAction.status === 'sent'
                        ? 'Resend code'
                        : 'Verify phone'}
                </button>
                {phoneVerificationAction.status === 'sent' && (
                  <p className="mt-3 text-sm text-green-700" role="status">
                    Verification code sent. Enter the six-digit code below.
                  </p>
                )}
                {phoneVerificationAction.status === 'error' && (
                  <p className="mt-3 text-sm text-red-600" role="alert">
                    {phoneVerificationAction.error}
                  </p>
                )}
                {phoneCodeEntryVisible && (
                  <form className="mt-4" onSubmit={checkPhoneVerificationCode}>
                    <label
                      htmlFor="account-phone-verification-code"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Six-digit verification code
                    </label>
                    <input
                      id="account-phone-verification-code"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
                      value={phoneVerificationCode}
                      onChange={(event) => {
                        setPhoneVerificationCode(event.target.value);
                        setPhoneCodeAction({ status: 'idle', error: null });
                      }}
                      required
                    />
                    <button
                      type="submit"
                      className="mt-3 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={
                        phoneCodeAction.status === 'checking' ||
                        !/^[0-9]{6}$/.test(phoneVerificationCode)
                      }
                    >
                      {phoneCodeAction.status === 'checking'
                        ? 'Checking…'
                        : 'Verify code'}
                    </button>
                    {phoneCodeAction.status === 'error' && (
                      <p className="mt-3 text-sm text-red-600" role="alert">
                        {phoneCodeAction.error}
                      </p>
                    )}
                  </form>
                )}
              </div>
            )}
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
                Phone number saved. You can now verify it.
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
