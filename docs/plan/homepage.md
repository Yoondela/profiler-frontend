# Exalt homepage visual redesign

## Summary

Transform the homepage into a blue, illustration-led local-services marketplace. Remove the hero search entirely because global search remains in the navbar. Preserve the navbar and all request/booking form behaviour.

## Key changes

- Replace the rotating hero with a single marketplace message: “Local services, all in one place,” supported by a blue-toned illustration combining home, pool, car, camera, beauty, and event motifs.
- Remove the hero `IntroSearch` component and its search-result display. The navbar search remains the only global provider/service search entry point.
- Keep the current navbar unchanged; retain its blue theme and use complementary deep blue, teal-blue accent, pale blue-grey backgrounds, white cards, and charcoal text across the homepage.
- Add a visual-only “Explore services” grid:
  - Home & outdoor: Cleaning, Gardening, Pool cleaning, Roof cleaning
  - Vehicle care: Car wash
  - Events & lifestyle: Photography, Makeup, Décor, Catering
  - Cards use code-native blue line illustrations/icons and do not navigate or prefill forms.
- Restyle the existing forms as two distinct, paired sections:
  - “Need help today?” retains the current request form unchanged.
  - “Planning ahead?” retains the current booking form unchanged.
  - Improve spacing, typography, blue action styling, and accompanying illustration panels only.
- Replace the current benefits presentation with a compact trust section covering verified professionals, flexible scheduling, and local discovery.
- Add an informational provider callout near the footer: “Offer your services on Exalt,” with no new route or interaction.

## Interfaces and behaviour

- No API, routes, form fields, validation, request/booking payloads, or submission behaviour change.
- Navbar search is unchanged and remains the sole search experience.
- Hero search and its results are removed.
- All new category and provider elements are presentational only.

## Test plan

- Verify navbar search, request-now form, and scheduled-booking form behave exactly as before.
- Verify the removed hero search has no remaining rendered UI or orphaned layout space.
- Verify desktop, tablet, and mobile layouts have no overflow or form regressions.
- Check keyboard focus and contrast for existing form controls and primary buttons.
- Run lint and production build checks.

## Assumptions

- Exalt is a broad local-services marketplace.
- Initial visible categories are Cleaning, Gardening, Pool Cleaning, Roof Cleaning, Car Wash, Photography, Makeup, Décor, and Catering.
- The current navbar’s blue theme remains the visual source of truth.
