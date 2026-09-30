# Exalt roadmap

## 1. Homepage visual redesign ✅

- 1.1 Homepage design foundation ✅
  - ✅ Add homepage-scoped colour, spacing, card, and responsive layout styles using the existing blue theme.
  - ✅ Reuse existing TailwindCSS and SCSS conventions without affecting other pages.
  - ✅ Verify the navbar remains visually and functionally unchanged by scoping the new styles to the homepage wrapper.

- 1.2 Static marketplace hero ✅
  - ✅ Replace the rotating hero with a single illustration-led marketplace hero.
  - ✅ Remove the hero search UI and its result display.
  - ✅ Keep navbar search as the only global search entry point.
  - ✅ Use copy that positions Exalt as a broad local-services marketplace.

- 1.3 Service discovery presentation ✅
  - ✅ Add a responsive, visual-only “Explore services” category grid.
  - ✅ Present Home & outdoor: Cleaning, Gardening, Pool Cleaning, and Roof Cleaning.
  - ✅ Present Vehicle care: Car Wash.
  - ✅ Present Events & lifestyle: Photography, Makeup, Décor, and Catering.
  - ✅ Use existing or code-native blue icons; do not add navigation, prefill, or request behaviour.

- 1.4 Request-now presentation ✅
  - ✅ Restyle the existing service-request section as “Need help today?”.
  - ✅ Preserve all request fields, autocomplete, confirmation drawer, validation, and submission behaviour.
  - ✅ Apply only homepage presentation changes around the existing form.

- 1.5 Schedule-ahead presentation ✅
  - ✅ Restyle the existing booking section as “Planning ahead?”.
  - ✅ Preserve existing date/time selection, service/address details, notification content, and booking behaviour.
  - ✅ Match the request-now section’s visual treatment.

- 1.6 Trust and provider presentation ✅
  - ✅ Replace the benefits composition with concise trust signals for verified professionals, flexible scheduling, and local discovery.
  - ✅ Add a presentational provider callout: “Offer your services on Exalt.”
  - ✅ Do not introduce provider signup routes or interactions.

- 1.7 Verification and polish ✅
  - ✅ Complete responsive layout, focus-state, contrast, and section-spacing polish.
  - ✅ Verify navbar search, service requests, and scheduled bookings work unchanged.
  - ✅ Confirm no orphaned hero-search UI or styles remain.
  - ✅ Run lint.
  - ✅ Run a production build.

## 2. Login, signup, and application-user bootstrap — **current**

Goal: after Auth0 authenticates a person, create or retrieve the matching Exalt
user and profile before authenticated application features start. Keep Auth0
responsible for credentials, password reset, and identity verification.

### 2.1 Establish one bootstrap path — **current**

- Keep one `UserProvider` beneath the Auth0 provider at the application root.
- After Auth0 reports an authenticated session, request one audience-bound
  access token and call `POST /api/users` with no browser identity fields.
- Accept both the backend's `200` existing-user and `201` new-user outcomes.
- Use the returned `newUser` and `profile` as the initial application state;
  do not immediately repeat the lookup through `/users/me`.
- Populate the existing application-user, profile, provider-role, avatar, and
  Flack identifiers from that authoritative result.
- Remove the obsolete mounted `CreateUser` bootstrap component without
  removing lookup helpers that still have active consumers.

**Done when:** login and signup use one authenticated, retry-safe provisioning
request and expose one application user and profile to the rest of the app.

### 2.2 Gate authenticated application features

- Represent anonymous, authenticating, provisioning, ready, conflict, and
  failure states in the existing user context.
- Do not mount application-user-dependent providers or authenticated screens
  until provisioning is ready.
- Show a focused account-setup loading state while provisioning is in progress.
- Clear application-user and profile state when the Auth0 session ends.
- Keep React Strict Mode enabled and rely on the backend's idempotent contract
  to make development retries harmless.

**Done when:** no authenticated feature runs with a missing application user,
and refresh or logout cannot leave stale account state behind.

### 2.3 Align sign-in, signup, callback, and logout

- Keep **Sign in** on the normal Auth0 Universal Login flow.
- Add a distinct **Create account** action using Auth0's signup hint; do not add
  local password fields or credential storage.
- Preserve the requested return location through Auth0 `appState`.
- Give the Auth0 provider one clear owner for post-callback navigation and keep
  the callback route as a loading/error surface only if it remains necessary.
- Ensure logout returns to the public application and resets local account
  bootstrap state.

**Done when:** database signup, Google signup, returning-user login, callback,
refresh, and logout all enter and leave the same bootstrap lifecycle.

### 2.4 Handle provisioning outcomes visibly

- Show safe guidance for `409 ACCOUNT_IDENTITY_CONFLICT` without revealing the
  other account's sign-in method.
- Show retry and sign-out actions for temporary network or server failures.
- Treat `401` as an invalid or expired authentication session and guide the
  person back through sign-in.
- Allow an authenticated but unverified user into the normal application;
  verified-email enforcement and account linking remain later backend-led work.
- Do not leave provisioning errors only in developer-console output.

**Done when:** every expected backend outcome has a clear user-visible state
and a safe recovery action.

### 2.5 Focused verification and completion

- Run lint on the changed authentication and user-bootstrap files, then run a
  production build. Report unrelated existing lint failures separately.
- Manually verify new database signup, new Google signup, returning login,
  refresh, Strict Mode retries, identity conflict, retryable failure, logout,
  and login as a different user.
- Confirm the frontend sends the configured Auth0 audience and API base URL in
  development and the deployment environment without exposing backend secrets.
- Record any remaining email-based user lookups as separate follow-up work;
  do not broaden this milestone into every authenticated feature.

**Done when:** the backend provisioning contract is exercised end to end and
the frontend never silently enters a partial signed-in state.

### Recorded follow-up: replace legacy email-derived application-user lookups

- `getUserID` in `src/api/sync/SyncUser.jsx` receives the Auth0 browser email
  and calls `GET /api/users/email/:email`. It is actively used by provider
  portfolio, bookings, gallery, service request/booking, review, company, and
  staff-invite flows.
- `UserProfileView` also fetches the signed-in account by Auth0 browser email.
  `useUserByEmail` remains available from the same sync module.
- Plan a coordinated backend/frontend transition to use the provisioned
  application-user ID and profile already held by `UserProvider`. Preserve any
  legitimate public or administrative email lookup separately; do not change
  this endpoint or its consumers as part of the authentication bootstrap work.

## Backlog

### Responsive sidebar routes

- Shared mobile sidebar shell
  - Add a mobile-only sidebar trigger outside the closed sidebar sheet.
  - Keep the existing Shadcn off-canvas sheet below `768px` and close it after mobile navigation.
  - Add `min-w-0 w-full` to the shared content column to prevent horizontal overflow.
  - Preserve the existing collapsible desktop sidebar, navigation, active states, indicators, avatars, and keyboard shortcut.
  - Do not modify the unused legacy sidebar component.

- Account and booking views
  - Make dashboard tabs and booking cards fit phone widths without changing their desktop presentation.
  - Adapt profile fields, saved addresses, and edit actions for narrow viewports while retaining the desktop two-column layout.
  - Refine calendar spacing and prevent overflow without changing month navigation or booking selection.
  - Reduce mobile padding in bookings and adapt bookmarks to a compact phone card layout.

- Provider portfolio and gallery views
  - Preserve the desktop provider portfolio layout while allowing mobile headers and controls to wrap without overflow.
  - Make portfolio editing controls touch-accessible without changing edit, upload, collapse, or review behaviour.
  - Change gallery columns responsively: two below `640px`, three from `640px`, four from `768px`, and retain five at the current large-screen breakpoint.
  - Keep gallery uploads, deletion, primary-image selection, drag reordering, optimistic updates, and rollback behaviour unchanged.

- Verification and regression checks
  - Verify all sidebar routes at `320px`, `375px`, `640px`, `767px`, `768px`, `1024px`, and wide desktop widths.
  - Confirm mobile sidebar navigation works with touch and keyboard, and the sheet closes after navigation.
  - Confirm no sidebar route has page-level horizontal scrolling.
  - Verify gallery controls remain usable without hover and all existing profile, calendar, bookmark, and gallery actions behave unchanged.
  - Run lint and a production build.
