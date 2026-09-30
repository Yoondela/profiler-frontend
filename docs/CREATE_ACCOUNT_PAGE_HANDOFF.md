# Create-account page handoff

## Objective

Create a branded, responsive **Create account** experience for Exalt. Keep the
existing **Sign in** flow unchanged.

The intended composition is a split screen on desktop:

- left: Auth0's hosted signup/login widget, including database and social
  connection controls;
- right: an Exalt-designed panel that communicates the local-services
  marketplace through service imagery, concise value proposition copy, and
  trust signals.

On mobile, the Auth0 widget must remain the primary content and the Exalt panel
must collapse or move below it without obscuring form controls.

## Security and ownership boundary

Auth0 continues to own credentials, signup, Google login, password reset,
email verification, MFA, and all credential-form validation. Do not add local
email/password inputs, credential storage, password reset, or custom
authentication submission to the React application.

The real split-screen page belongs to an Auth0 Universal Login page template:
the template renders Auth0's widget on the left and Exalt content around it.
The React application can prepare reusable visual content, but cannot embed the
Auth0 credential widget locally.

## Current application behavior

- `src/components/sub/Navbar.jsx` has separate actions:
  - **Sign in** calls normal `loginWithRedirect` and preserves the requested
    application return path in `appState`.
  - **Create account** calls `loginWithRedirect` with
    `authorizationParams.screen_hint: 'signup'` and the same return path.
- `src/auth/Auth0ProviderWithRedirect.jsx` is the sole owner of post-callback
  navigation and accepts internal return paths only.
- `src/api/context/userContext.jsx` provisions the application user after Auth0
  returns. It uses `POST /api/users` with an audience-bound token and consumes
  `{ newUser, profile }`.
- The current backend deliberately returns a visible retryable failure until
  the Auth0 Management API client is configured with `read:users`. The frontend
  recovery UI is already implemented; do not bypass provisioning or trust
  browser identity fields to make the screen appear successful.

## Auth0 work required later

Dashboard access is required to make the visual composition live:

1. Confirm the tenant uses Universal Login and supports the required page
   template/custom-domain setup.
2. Configure the Universal Login page template with Auth0's required head and
   widget placeholders.
3. Add the Exalt panel around the widget; do not modify the widget internals or
   depend on generated Auth0 DOM class names.
4. Verify database signup, Google signup, password reset, MFA, error screens,
   and mobile layout in the Auth0-hosted page.

Do not place Auth0 Management API credentials, tenant secrets, or branding API
tokens in `VITE_*` variables or commit them to this repository.

## Scope for the next chat

1. Confirm whether the next task is to prepare the reusable Exalt visual panel
   in this repository, or to configure and implement the Auth0 Universal Login
   template once Dashboard access is available.
2. If preparing the panel now, use the existing blue Exalt visual language,
   marketplace/service imagery, and responsive conventions. It must be
   presentational only and must not add a new authentication flow.
3. Preserve the existing Sign in action and its normal Universal Login
   behavior. Only the Create account entry point and hosted signup presentation
   are in scope.
4. Test keyboard navigation, readable contrast, long copy, 320px mobile width,
   tablet, and desktop. Do not alter the backend API contract.

## Out of scope

- Local credential forms or credential handling.
- Changes to backend provisioning, Auth0 Management API configuration, email
  verification policy, or account linking.
- Replacing the existing Sign in experience.
- The recorded migration away from legacy email-derived application-user
  lookups in `ROADMAP.md`.

## Useful files

- `src/components/sub/Navbar.jsx`
- `src/auth/Auth0ProviderWithRedirect.jsx`
- `src/api/context/userContext.jsx`
- `src/App.jsx`
- `src/components/auth/ProvisioningRecovery.jsx`
- `ROADMAP.md` — current authentication/bootstrap milestone and follow-up work
