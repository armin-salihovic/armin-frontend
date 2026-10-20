# Progress

## What Works

- SvelteKit app structure is present.
- Main public route files exist for Home, Projects, Project Detail, About, Contact, CV redirect, sitemap, and error page.
- API-backed loading is implemented for home, about, projects, project detail, settings, CV, and sitemap.
- Shared layout/header/footer exists through `MainLayout.svelte`.
- SEO metadata rendering exists through `Seo.svelte`.
- Project listing and project detail panel behavior are implemented.
- Contact form UI, validation, sending state, and message feedback are implemented.
- Tailwind CSS and global styling are configured.
- Lazy-loading components/utilities are present.
- Dark mode is implemented with a persistent accessible header switch component, system preference fallback, Tailwind `dark:*` classes, and global CSS fallbacks for backend-rendered content.
- Project page header logo remains visible when a project detail panel is open, including in dark mode.

## What Is Left / Unknown

- README still needs project-specific documentation if desired.
- A Node built-in test suite is available through `npm test`.
- No linting or separate check commands are currently configured.
- Backend API schema is inferred from frontend usage but not documented in this repository.
- Deployment target is not documented; `adapter-auto` is currently used.
- `.env.example` should be checked/updated when documenting local setup more thoroughly.

## Known Issues

- `src/routes/contact/+page.server.js` is empty.
- Some API load functions do not handle non-OK responses.
- Contact form error handling may not surface backend validation errors unless failures are explicitly thrown.
- Settings loading uses subscriptions for immediate value reads; this is functional but should be reviewed carefully if refactored.

## Current Status

Final frontend hardening completed on 2026-10-20. Project-panel caching stores only valid successful project data; 404 and transient failures render localized panel messages and can retry. Loading, error, close, locale, and history changes are guarded so late requests cannot open the wrong panel. Live backend checks found German home/about are unpublished (404), and 3 of 5 projects have German translations. The frontend sitemap emitted 14 published URLs. `npm test` (14 tests) and `npm run build` pass.

## Recommended Next Steps

1. Update `README.md` with project-specific setup and environment documentation.
2. Inspect `.env.example` and document required environment variables.
3. Add linting/formatting and basic validation commands if desired.
4. Improve API error handling in route load functions.
5. Review the empty contact server file and remove or implement it.
