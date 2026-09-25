import CreateAccountMarketingPanel from '@/components/auth/CreateAccountMarketingPanel';

export default function CreateAccountPreview() {
  return (
    <main className="create-account-preview">
      <section
        className="create-account-preview__auth-shell"
        aria-labelledby="auth0-preview-title"
      >
        <div className="create-account-preview__auth-content">
          <p className="create-account-preview__brand">EXALT</p>
          <p className="create-account-preview__eyebrow">Create account</p>
          <h1 id="auth0-preview-title">Your Auth0 signup form appears here.</h1>
          <p>
            This is a visual boundary only. In the live experience, Auth0 hosts
            the secure signup, social login, and credential-recovery controls.
          </p>
          <div
            className="create-account-preview__widget-skeleton"
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>
      <CreateAccountMarketingPanel />
    </main>
  );
}
