export default function ProvisioningRecovery({
  bootstrapStatus,
  provisioningError,
  onRetry,
  onSignOut,
}) {
  const isIdentityConflict = bootstrapStatus === 'conflict';
  const isUnauthorized = provisioningError?.status === 401;
  const title = isIdentityConflict
    ? 'We could not set up this account'
    : isUnauthorized
      ? 'Your sign-in session has expired'
      : 'We could not finish setting up your account';
  const message = isIdentityConflict
    ? 'This email cannot be used to create a new account. Please sign in with the account you already use.'
    : isUnauthorized
      ? 'Please sign in again to continue.'
      : 'Please try again. If the problem continues, sign out and try again later.';

  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-sm text-gray-600">{message}</p>
        <div className="flex flex-wrap justify-center gap-3">
          {!isIdentityConflict && !isUnauthorized && (
            <button
              onClick={onRetry}
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Try again
            </button>
          )}
          <button
            onClick={onSignOut}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
          >
            {isUnauthorized ? 'Sign in again' : 'Sign out'}
          </button>
        </div>
      </div>
    </main>
  );
}
