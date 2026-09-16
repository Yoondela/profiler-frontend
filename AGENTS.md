# Profiler frontend

Work only in this repository unless coordinated backend implementation is explicitly requested. If a backend contract must change, describe it rather than silently changing the backend. Make small, focused, reviewable changes: no unrelated restyling/cleanup, speculative features/optimizations, broad redesigns/refactors, new state or styling systems, dependencies, or opportunistic domain renames. Do not edit `src/components/ui/`.

## Roadmap and reporting

Use root `ROADMAP.md` to identify current work; keep milestones/stages/tasks hierarchical, mark the current stage and completed work, and do not implement future milestones. Replacing a roadmap means removing the previous version. Treat `docs/NEXT_VERSION_IDEAS.md` as future-only.

After code changes, provide a numbered per-file summary (path, Created/Edited/Deleted, short description) and net line count (`added - deleted = net`).

## Domain, React, and contracts

`provider`, `portfolio`, `worker`, `staff`, `member`, `company`, `owner`, and `user` are protected, inconsistent terms. Do not rename, merge, normalize, or reinterpret them without an authorized coordinated migration. Before changing one, trace its API source/field, hooks, context, state, components, contextual meaning, and backend risk; ask if ambiguous. Preserve route parameters, API fields, context shapes, and event payloads.

Do not mutate React state; use setters and immutable updates. Keep effects narrow with accurate dependencies. Avoid needless duplicate/derived state, global state, abstractions, memoization, caching, or request deduplication; investigate remounts/effects and measure real performance bottlenecks first. Preserve loading, error, and empty states unless the task changes them.

Before API or Socket.IO changes, find the client function and all callers, record the contract and status/loading/error behaviour, and confirm backend compatibility. Do not change request/response fields, route parameters, or event payloads independently, and do not swallow backend errors.

## Auth, UI, and runtime configuration

Auth0 owns identity: do not add local password handling or store credentials beyond SDK needs. Separate Auth0 identity, application profile, authentication status, authorization UI, and account linking. UI guards/hidden controls are not security boundaries. For login/signup changes, trace Auth0/SDK configuration, callback, tokens, provisioning, loading/errors, redirects, and duplicate requests.

Keep existing SCSS or Tailwind per component; use the neighbouring feature's pattern for new components. Avoid global styling changes and unrelated visual redesign. For affected screens, check representative mobile/tablet/desktop widths, hierarchy, navigation, touch targets, readability, overflow, forms/keyboards, overlays/sticky elements, realistic long data, and loading/empty/error states. For Flack also check conversation navigation, scrolling, composer, virtual keyboard where possible, attachments, and connection states.

Do not read runtime-only environment values unnecessarily at module load. Keep `.env` out of Docker builds/images; use deployment runtime configuration. Never expose backend secrets through `VITE_` variables, which are public client configuration.

## Tests, Git, and reviews

Classify failures as regression, stale expectation, obsolete test, environment failure, or unknown before changing implementation. Never delete, skip, or weaken tests to pass; characterize intended behaviour before risky refactors. Prioritize auth/provisioning, provider/portfolio, search, bookings, company/worker, availability, Flack, navigation, and protected screens.

Before work inspect Git status, relevant baseline failures, and affected routes/components/hooks/contexts/API calls. Afterwards run targeted tests, practical broader tests, configured lint/type/build, responsive checks, and focused manual smoke tests; distinguish introduced failures from existing ones. Preserve unrelated changes. Do not edit `.env`, commit, push, open PRs, create branches, or use destructive Git/reverts without explicit request; never reveal secrets or private user data.

In review-only tasks, do not modify files. Review correctness, security, auth/authorization, validation, contracts, state, accessibility, error/loading states, and unnecessary complexity against backend contracts where needed. Report findings as **Blockers** (`Issue`, `Proposed fix`), **Should fix** (`Issue`, `Do`), and **Optional** (`Issue`, `Why optional`).

Conclude with behaviour changed/investigated, affected screens/flows, contract impact, responsive widths (if applicable), checks/results, pre-existing failures, risks/manual checks, and files changed.
