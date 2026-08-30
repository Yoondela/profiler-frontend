# Responsive sidebar routes

## Summary

Make every route rendered by `SidebarLayout` usable below `768px` while preserving all existing behaviour and leaving the tablet and desktop design unchanged.

## 1. Close the current roadmap milestone

- Run the outstanding full lint and production build checks.
- Mark homepage milestone 1 complete.
- Add milestone 2 for responsive sidebar routes and mark its first stage current.
- Create a dedicated implementation branch after the documentation update.

## 2. Fix the shared mobile sidebar shell

Update `SidebarLayout`, `AppSidebar`, and `NavMain` without changing their desktop classes.

- Add `min-w-0 w-full` to the main content column to prevent child content from forcing horizontal overflow.
- Add a sidebar trigger outside the sidebar sheet, visible only below `md`.
  - The current trigger is rendered inside the closed mobile sheet, so it cannot open the sidebar.
  - Place the mobile trigger in a compact route toolbar below the fixed navbar.
- Continue using the existing Shadcn off-canvas sheet below `768px`.
- Close the sheet after selecting a navigation link on mobile.
- Preserve the current collapsible icon sidebar at `768px` and above.
- Preserve all navigation targets, active states, notification indicators, avatars, and keyboard shortcut behaviour.
- Do not modify the legacy `components/sub/view/Sidebar.jsx`; these routes do not use it.

## 3. Adapt every sidebar page below 768px

Use mobile-first Tailwind changes where components already use Tailwind and SCSS media queries for the profile page.

### Dashboard

- Keep one booking card per row on phones.
- Allow the three-tab control to fit without overflow using smaller mobile padding and text.
- Preserve the existing desktop card counts and tab design.

### Profile

- Keep basic information and preferences stacked on mobile.
- Reduce outer padding below `768px`.
- Stack saved-address inputs and actions when space is limited.
- Make form controls and save/edit buttons full-width where appropriate on phones.
- Retain the existing two-column desktop presentation from `1020px`.

### Portfolio

- Preserve the current desktop header, cards, gallery, reviews, and editing layout.
- Ensure mobile headers wrap cleanly and content cannot overflow.
- Make hover-only editing controls visible and touch-accessible on mobile.
- Keep existing upload, edit, collapse, and review behaviour unchanged.

### Calendar

- Retain the existing mobile calendar-first, schedule-second stacking.
- Reduce excessive mobile top spacing and page padding.
- Ensure all seven calendar columns remain within the viewport.
- Preserve month navigation and booking selection behaviour.

### Gallery manager

- Replace the fixed five-column grid with:
  - 2 columns below `640px`.
  - 3 columns from `640px`.
  - 4 columns from `768px`.
  - The existing 5-column design at the current large-screen breakpoint.
- Reduce upload and gallery gutters on phones.
- Keep square thumbnails.
- Show delete, cover, and drag controls without hover on touch widths; preserve hover treatment on larger screens.
- Add accessible labels and adequate touch targets.
- Do not alter upload limits, Supabase calls, deletion, primary-image selection, optimistic reordering, or rollback behaviour.

### Bookings

- Use smaller mobile page padding while keeping the existing desktop maximum width.
- Make no behavioural or data changes.

### Bookmarks

- Use a compact mobile card layout with a smaller or stacked image.
- Keep the current horizontal desktop card unchanged.
- Preserve provider navigation, removal, loading, empty, and error behaviour.

## 4. Responsive boundaries

- Apply mobile-specific changes below `768px`.
- Leave the existing `md`, `lg`, `xl`, and `2xl` presentation unchanged unless a rule is required solely to prevent overflow.
- Do not introduce new dependencies, routes, API changes, state shapes, or shared domain abstractions.
- Do not redesign colours, typography, cards, or navigation.
- Do not address the currently unresolved `/history` and `/upcoming` destinations as part of this slice; report them separately.

## 5. Verification

Test at `320px`, `375px`, `640px`, `767px`, `768px`, `1024px`, and a wide desktop viewport.

Acceptance criteria:

- Mobile users can open, close, and navigate through the sidebar using touch and keyboard.
- The sidebar closes after mobile navigation.
- No sidebar route produces page-level horizontal scrolling.
- Gallery controls work without hover.
- Upload, delete, primary-image selection, and drag reordering remain unchanged.
- Profile editing and saving remain unchanged.
- Calendar navigation and booking selection remain unchanged.
- Bookmark navigation and removal remain unchanged.
- Desktop layouts at `768px` and above visually match the current implementation.
- Run focused lint during implementation, followed by full lint and a production build.
