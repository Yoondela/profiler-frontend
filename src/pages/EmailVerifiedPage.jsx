import { useAuth0 } from '@auth0/auth0-react';
import { useSearchParams } from 'react-router-dom';

export default function EmailVerifiedPage() {
  const { loginWithRedirect } = useAuth0();
  const [searchParams] = useSearchParams();
  const verified = searchParams.get('success') === 'true';

  const continueToSignIn = () =>
    loginWithRedirect({ appState: { returnTo: '/account' } });

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-8">
      <section className="w-full rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">
          {verified ? 'Email verified' : 'Email verification'}
        </h1>
        <p className="mt-3 text-gray-600">
          {verified
            ? 'Your email has been verified. Sign in to continue using Exalt.'
            : 'Sign in to continue using Exalt.'}
        </p>
        <button
          type="button"
          className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          onClick={continueToSignIn}
        >
          Continue to sign in
        </button>
      </section>
    </main>
  );
}
