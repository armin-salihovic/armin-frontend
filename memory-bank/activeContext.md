# Active Context

## Current Work Focus

Dark mode has been implemented for the existing `armin-frontend` SvelteKit project.

## Recent Findings

- `memory-bank/` existed but had no files before initialization.
- Project is a SvelteKit frontend with Svelte 3 and Vite 3.
- Styling relies heavily on Tailwind utility classes plus global CSS files.
- Backend integration is controlled by `PUBLIC_API_BASE_URL` from `$env/static/public`.
- Settings are stored in a Svelte writable store and loaded from `/settings`.
- Dark mode now uses Tailwind's class strategy with the `dark` class applied to `<html>`.
- Theme preference is initialized early in `src/app.html` to reduce flash of incorrect theme, then synchronized through `src/theme.js` and the `theme` store.
- Tailwind CSS is `^3.1.8`; avoid newer palette shades such as `neutral-950` because they are not generated in this version.

## Important Current Patterns

- Routes use SvelteKit file routing under `src/routes`.
- Shared layout is implemented through `src/components/MainLayout.svelte`, not through a root `+layout.svelte` component.
- `src/routes/+layout.js` loads global settings if the settings store is `null`.
- Shared stores live in `src/store.js`:
  - `panelOpen`
  - `panelData`
  - `settings`
  - `cache`
  - `theme`
- Project panel logic lives in `src/panel.js` and is consumed by `MainLayout.svelte` and the projects page.
- SEO tags are centralized in `src/components/Seo.svelte`.
- Lazy-loading behavior is centralized in `src/lazy-loading.js`, `src/lazy-loading.css`, `LazyLoading.svelte`, and `LazyLoadingWrapper.svelte`.
- Theme logic lives in `src/theme.js` with `initTheme()` and `toggleTheme()`.
- `MainLayout.svelte` initializes the theme on mount and renders `ThemeToggle.svelte` aligned to the far right of the top navigation.
- `ThemeToggle.svelte` owns the accessible icon-only sun/moon pill switch markup, inline SVGs, and local switch styling.

## Active Decisions and Considerations

- Preserve existing JavaScript style and Svelte 3 conventions unless a task explicitly asks for modernization.
- Avoid assuming API response schemas beyond what current components already require.
- Any changes to settings loading must consider SSR/browser behavior and Svelte writable store subscriptions.
- Project detail UX depends on custom `beforeNavigate`, `onpopstate`, history manipulation, and panel store state.
- Tailwind class safelisting appears partially handled by commented backend-support classes in `src/routes/projects/[slug]/+page.svelte`; be careful removing them because backend-generated HTML may rely on those classes.
- Because page/article body content is injected with `{@html ...}`, dark-mode fallbacks for backend-rendered content belong in `src/style.css` in addition to Tailwind classes in Svelte components.
- Dark backgrounds should use Tailwind 3.1-compatible utilities such as `dark:bg-neutral-900` plus global CSS fallbacks in `src/style.css` for `.dark`, `.dark body`, `.dark .content`, `.dark .content header`, and `.dark .inner-panel`.
- Preserve the original wide-screen right sidebar contrast in dark mode: `.dark` and `.dark body` use `#111111`, while the main content surface uses `#171717`.
- Keep the sun icon inside `ThemeToggle.svelte` light and readable in dark mode; do not dim it too aggressively because it sits near/under the moving thumb.
- Current requested dark palette: main dark text/lines `#dddad6`, muted `.text-gray-500` equivalent `#9e9589`, main content background `#181a1b`, and body/right-sidebar background `#111111`.

## Known Issues / Areas to Watch

- `README.md` is still the default create-svelte README.
- No lint, format, or test scripts are defined in `package.json`.
- `src/routes/contact/+page.server.js` is empty.
- Error handling around API requests is minimal in several route load functions.
- Contact form `catch` block assumes error shape that may not be produced by `fetch` unless errors are explicitly thrown.
