# Exalt roadmap

## 1. Homepage visual redesign — **current**

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

- 1.7 Verification and polish — **current**
  - Complete responsive layout, focus-state, contrast, and section-spacing polish.
  - Verify navbar search, service requests, and scheduled bookings work unchanged.
  - Confirm no orphaned hero-search UI or styles remain.
  - Run lint and a production build.
