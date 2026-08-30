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

## 2. Responsive sidebar routes — **current**

- 2.1 Shared mobile sidebar shell — **current**
  - Add a mobile-only sidebar trigger outside the closed sidebar sheet.
  - Keep the existing Shadcn off-canvas sheet below `768px` and close it after mobile navigation.
  - Add `min-w-0 w-full` to the shared content column to prevent horizontal overflow.
  - Preserve the existing collapsible desktop sidebar, navigation, active states, indicators, avatars, and keyboard shortcut.
  - Do not modify the unused legacy sidebar component.

- 2.2 Account and booking views
  - Make dashboard tabs and booking cards fit phone widths without changing their desktop presentation.
  - Adapt profile fields, saved addresses, and edit actions for narrow viewports while retaining the desktop two-column layout.
  - Refine calendar spacing and prevent overflow without changing month navigation or booking selection.
  - Reduce mobile padding in bookings and adapt bookmarks to a compact phone card layout.

- 2.3 Provider portfolio and gallery views
  - Preserve the desktop provider portfolio layout while allowing mobile headers and controls to wrap without overflow.
  - Make portfolio editing controls touch-accessible without changing edit, upload, collapse, or review behaviour.
  - Change gallery columns responsively: two below `640px`, three from `640px`, four from `768px`, and retain five at the current large-screen breakpoint.
  - Keep gallery uploads, deletion, primary-image selection, drag reordering, optimistic updates, and rollback behaviour unchanged.

- 2.4 Verification and regression checks
  - Verify all sidebar routes at `320px`, `375px`, `640px`, `767px`, `768px`, `1024px`, and wide desktop widths.
  - Confirm mobile sidebar navigation works with touch and keyboard, and the sheet closes after navigation.
  - Confirm no sidebar route has page-level horizontal scrolling.
  - Verify gallery controls remain usable without hover and all existing profile, calendar, bookmark, and gallery actions behave unchanged.
  - Run lint and a production build.
