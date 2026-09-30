import { useAuth0 } from '@auth0/auth0-react';
import CreateAccountMarketingPanel from '@/components/auth/CreateAccountMarketingPanel';

export default function CreateAccountPreview() {
  const { loginWithRedirect } = useAuth0();

  const startSignup = () =>
    loginWithRedirect({
      authorizationParams: { screen_hint: 'signup' },
      appState: { returnTo: '/' },
    });

  const startSignin = () =>
    loginWithRedirect({
      appState: { returnTo: '/' },
    });

  return (
    <main className="create-account-preview">
      <section
        className="create-account-preview__auth-shell"
        aria-labelledby="auth0-preview-title"
      >
        <div className="create-account-preview__auth-content">
          <p className="create-account-preview__brand">EXALT</p>
          <p className="create-account-preview__eyebrow">Create account</p>
          <h1 id="auth0-preview-title">
            Join Exalt and find trusted local help.
          </h1>
          <p>
            Create your account securely with Auth0, then discover reliable
            professionals for the services you need.
          </p>
          <div className="create-account-preview__actions">
            <button type="button" onClick={startSignup}>
              Create account
            </button>
            <button
              type="button"
              className="create-account-preview__secondary-action"
              onClick={startSignin}
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </section>
      <CreateAccountMarketingPanel />
    </main>
  );
}
