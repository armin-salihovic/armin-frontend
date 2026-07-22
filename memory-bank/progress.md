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
- Project page header logo remains visible when a project detail panel is open in dark mode.

## What Is Left / Unknown

- README still needs project-specific documentation if desired.
- No automated tests are currently configured.
- No linting/formatting commands are currently configured.
- Backend API schema is inferred from frontend usage but not documented in this repository.
- Deployment target is not documented; `adapter-auto` is currently used.
- `.env.example` should be checked/updated when documenting local setup more thoroughly.

## Known Issues

- `src/routes/contact/+page.server.js` is empty.
- Some API load functions do not handle non-OK responses.
- Contact form error handling may not surface backend validation errors unless failures are explicitly thrown.
- Settings loading uses subscriptions for immediate value reads; this is functional but should be reviewed carefully if refactored.

## Current Status

Dark mode implementation completed on 2026-07-22. The top nav now uses `ThemeToggle.svelte`, an accessible icon-only sun/moon pill-style light/dark switch aligned to the far right and absolutely positioned so it does not shift Projects/About/Contact. The sun icon contrast was improved for dark mode. Fixed an issue where backgrounds stayed white by replacing unsupported Tailwind 3.1 `neutral-950` classes with explicit palette colors and global dark background fallbacks. Current palette: main text/lines `#dddad6`, muted gray `#9e9589`, main background `#181a1b`, body/right-sidebar `#111111`. Fixed the projects page header logo becoming invisible when a project detail panel is open in dark mode by changing the panel-open logo wrapper to `invert dark:invert-0` in `src/components/PageHeader.svelte`. `npm.cmd run build` succeeds; `npm run build` directly in PowerShell is blocked by local script execution policy for `npm.ps1`.

## Recommended Next Steps

1. Update `README.md` with project-specific setup and environment documentation.
2. Inspect `.env.example` and document required environment variables.
3. Add linting/formatting and basic validation commands if desired.
4. Improve API error handling in route load functions.
5. Review the empty contact server file and remove or implement it.
