# AGENTS.md

### Roadmap structure

When creating or restructuring `ROADMAP.md`, organize work hierarchically:

ROADMAP.md always live in root folder
When writing a new roadmap remove the old one

* **Milestone** — major phase of the project, numbered `1`, `2`, `3`, etc.
* **Stage** — a meaningful deliverable within a milestone, numbered `4.1`, `4.2`, `4.3`, etc.
* **Tasks** — concrete implementation work required to complete the stage.

Example:

```md
## 4. UI / Frontend — **current**

- 4.1 Shared public layout ✅
  - ✅ Establish site navigation and responsive page container.
  - ✅ Add primary navigation.
- 4.2 Public presentation — **current**
  - Refine the main content presentation.
  - Add responsive layouts.
- 4.3 Management interface
  - Improve management-page information hierarchy.
  - Improve create and edit flows.
```

## Project progression

Use `ROADMAP.md` to determine the current milestone and what work comes next.

Do not implement later milestones prematurely.

When asked what to work on next, inspect the roadmap and current implementation before proposing work.

Keep the roadmap up to date with **current** to show where we are and checkmark completed tasks with ✅.

## Implementation summary

After making code changes, show a numbered list of affected files.

Below the list, end with the number of lines added minus lines deleted.

Example:

1. `src/components/Navbar.jsx` — Created — Added navigation component.
2. `src/context/BookingContext.jsx` — Edited — Simplified booking state handling.
3. `src/styles/legacy.scss` — Deleted — Removed unused legacy styles.

Line count: added 4 - deleted 3 = +1.

For each file, include:

1. path
2. status: Created / Edited / Deleted
3. short description of the change

## Runtime environment configuration

* Do not read or validate runtime-only environment variables unnecessarily at module evaluation time.
* Keep `.env` files and secrets out of Docker build contexts and images.
* Provide production/runtime configuration through the deployment environment.
* Never expose backend secrets through Vite client environment variables.
* Treat variables prefixed with `VITE_` as publicly accessible client-side configuration.

## Git Discipline

* Avoid working on the main branch.
* If on main and significant changes are required, create or switch to a relevant branch.
* Documentation is only commited on main branch
* Small tasks such as aligning a button, fixing a typo, or renaming a function may be made directly on main.

# Exalt implementation rules

## Preserve existing behaviour

* Refactoring must preserve existing behaviour unless the task explicitly requires a behavioural change.
* Do not redesign architecture while performing an unrelated cleanup.
* Do not change API contracts, routes, authentication behaviour, state shapes, event names, or domain semantics unless explicitly required.
* Do not refactor unrelated files simply because they could be improved.
* If unrelated problems are discovered, report them instead of silently expanding the task.

## Inspect before editing

Before changing an existing feature, inspect enough of the surrounding implementation to understand:

* where its state comes from
* which components consume it
* relevant contexts and hooks
* API requests and expected payloads
* related routes
* related SCSS / TailwindCSS
* shared utilities
* backend contracts when the frontend depends on them

Do not make assumptions about a flow from a single component when the behaviour spans multiple files.

## Scope changes narrowly

* Prefer small, reviewable changes over broad rewrites.
* One task should address one primary concern.
* Do not combine architectural changes, behavioural changes, styling changes, and cleanup unless they are necessary for the same task.
* Prefer incremental migration over replacing a working feature all at once.
* Do not introduce new dependencies without approval.
* Do not introduce a new architectural pattern solely because it is cleaner in isolation.
* Reuse existing project patterns when they are still appropriate.

## React

* Keep components focused on a clear responsibility.
* Extract components when they represent meaningful independent UI or behaviour, not merely because a file is long.
* Keep complex business logic out of JSX where practical.
* Prefer named functions for non-trivial transformations, conditions, event handling, and payload construction.
* Do not mutate React state directly.
* Avoid storing values in state when they can be reliably derived from existing state or props.
* Keep state as close as practical to the components that need it unless it is genuinely shared.
* Do not move state into global context merely to avoid passing a small number of props.
* Reuse existing hooks and contexts before introducing additional state-management abstractions.

## Domain-critical flows

Treat the following as domain-critical areas:

* authentication and Auth0
* booking
* direct booking
* service requests
* provider/worker relationships
* profiles and portfolios
* companies and company staff
* company invitations
* calendar behaviour
* notifications
* Flack/chat and Socket.IO communication

When working around these areas:

* Trace the relevant flow before changing it.
* Do not rename domain fields based only on frontend usage.
* Verify backend models, endpoints, or event contracts when a frontend change affects shared data.
* Do not change request or response payload shapes independently from the backend.
* Do not change Socket.IO event names or payloads without checking both sender and receiver.
* Preserve authentication and authorization boundaries.
* Treat changes to shared contexts carefully because they may affect several otherwise unrelated screens.

## Domain terminology

Use established Exalt terminology consistently.

Do not introduce alternative names for existing domain concepts simply because another name appears clearer locally.

When terminology is inconsistent in the existing codebase, determine the intended canonical term before performing a broad rename.

A domain rename that crosses frontend/backend boundaries must be treated as a migration rather than a simple search-and-replace.

## Conditional logic

Prefer explicit, readable conditions over clever or ambiguous expressions.

For example, do not write:

`mode === 'booking' || 'direct-booking'`

Use:

`mode === 'booking' || mode === 'direct-booking'`

For multiple related values, an appropriately named boolean or `.includes()` check may be used when it improves readability.

Complex domain conditions should have descriptive names rather than being repeatedly embedded directly in JSX.

## API boundaries

* Keep API interaction separate from presentation logic where the existing architecture allows it.
* Do not silently change frontend payloads to compensate for unclear backend behaviour.
* Verify the backend contract first.
* Handle loading, success, empty, and error states where relevant.
* Do not swallow API errors without a deliberate user-facing or logging strategy.
* Avoid duplicating API request logic when an existing service/helper already owns that request.

## Cleanup and deletion

* Search for usages before deleting components, hooks, utilities, context values, styles, routes, or exports.
* Remove dead code only when there is reasonable evidence that it is unused.
* Do not remove apparently unused code when it may participate in dynamic routing, configuration, authentication, Socket.IO events, or other indirect behaviour without checking first.
* Do not mix large dead-code cleanup with unrelated feature implementation.

## Abstraction

Prefer:

correctness → readability → duplication reduction → structure → abstraction → visual polish

Do not create generic components, hooks, helpers, contexts, or utilities prematurely.

Prefer a small amount of obvious duplication over an abstraction that hides domain behaviour.

Introduce abstractions when repeated behaviour is understood well enough that the shared responsibility is clear.

# Reviewer mode

When reviewing requested changes, do not modify files unless explicitly asked.

Review for correctness, security, architecture, authentication and authorization, input validation, API boundaries, state management, maintainability, accessibility, error/loading states, and unnecessary complexity, abstractions, or dependencies.

For domain-critical Exalt flows, check frontend changes against the relevant backend contracts and shared event/payload structures where necessary.

Check changes against existing project documentation.

Prioritize blockers and important issues over style.

For every finding, explain why it matters and suggest a concrete fix.

Do not invent requirements or recommend extra architecture unless justified by the current requirements.

End reviews with findings grouped as: **Blockers**, **Should fix**, and **Optional**.

Structure **Blockers** with:

**Issue:**
**Proposed fix:**

Structure **Should fix** with:

**Issue:**
**Do:**

Structure **Optional** with:

**Issue:**
**Why optional:**

## UI / Styling

* The codebase uses both SCSS and Tailwind CSS.
* When restyling or modifying an existing component, use the styling system that component already uses.
* Do not convert an existing component from SCSS to Tailwind CSS, or from Tailwind CSS to SCSS, unless explicitly requested.
* For new components, follow the styling system used by nearby related components or the surrounding feature.
* Avoid mixing SCSS and Tailwind CSS inside the same component unless the existing component already does so or there is a clear reason. 
* Reuse existing variables, mixins, breakpoints, and shared styles where appropriate.
* Keep the interface functional and consistent with the existing Exalt design.
* Preserve existing responsive behaviour unless the task explicitly changes it.
* Prefer responsive layouts over viewport-specific duplicated components unless their behaviour genuinely differs.
* Do not perform unrelated visual redesigns while refactoring application logic.
* Functionality, readability, responsiveness, and accessibility come before decoration.

Ideas in `docs/NEXT_VERSION_IDEAS.md` are future considerations, not current requirements. Do not implement them as part of the current version.
