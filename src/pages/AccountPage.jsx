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

  if (authLoading) {
    return <main className="p-6">Loading account…</main>;
  }

  if (!isAuthenticated) {
    return <main className="p-6">Sign in to manage your account.</main>;
  }

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
            <VerificationRow
              label="Cell number"
              detail={verification.data.phone?.value}
              status={verification.data.phone?.status || 'not_provided'}
            />
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
