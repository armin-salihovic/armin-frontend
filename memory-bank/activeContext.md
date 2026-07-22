# Active Context

## Current Work Focus

Memory Bank initialization for the existing `armin-frontend` SvelteKit project.

## Recent Findings

- `memory-bank/` existed but had no files before initialization.
- Project is a SvelteKit frontend with Svelte 3 and Vite 3.
- Styling relies heavily on Tailwind utility classes plus global CSS files.
- Backend integration is controlled by `PUBLIC_API_BASE_URL` from `$env/static/public`.
- Settings are stored in a Svelte writable store and loaded from `/settings`.

## Important Current Patterns

- Routes use SvelteKit file routing under `src/routes`.
- Shared layout is implemented through `src/components/MainLayout.svelte`, not through a root `+layout.svelte` component.
- `src/routes/+layout.js` loads global settings if the settings store is `null`.
- Shared stores live in `src/store.js`:
  - `panelOpen`
  - `panelData`
  - `settings`
  - `cache`
- Project panel logic lives in `src/panel.js` and is consumed by `MainLayout.svelte` and the projects page.
- SEO tags are centralized in `src/components/Seo.svelte`.
- Lazy-loading behavior is centralized in `src/lazy-loading.js`, `src/lazy-loading.css`, `LazyLoading.svelte`, and `LazyLoadingWrapper.svelte`.

## Active Decisions and Considerations

- Preserve existing JavaScript style and Svelte 3 conventions unless a task explicitly asks for modernization.
- Avoid assuming API response schemas beyond what current components already require.
- Any changes to settings loading must consider SSR/browser behavior and Svelte writable store subscriptions.
- Project detail UX depends on custom `beforeNavigate`, `onpopstate`, history manipulation, and panel store state.
- Tailwind class safelisting appears partially handled by commented backend-support classes in `src/routes/projects/[slug]/+page.svelte`; be careful removing them because backend-generated HTML may rely on those classes.

## Known Issues / Areas to Watch

- `README.md` is still the default create-svelte README.
- No lint, format, or test scripts are defined in `package.json`.
- `src/routes/contact/+page.server.js` is empty.
- Error handling around API requests is minimal in several route load functions.
- Contact form `catch` block assumes error shape that may not be produced by `fetch` unless errors are explicitly thrown.
