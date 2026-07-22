# System Patterns

## Architecture Overview

The application is a SvelteKit frontend that renders a personal portfolio using API-backed content. It combines server/client route loading, shared Svelte stores, reusable layout/components, and global CSS/Tailwind styling.

## Key Modules

### Routing (`src/routes`)

- `/` uses `src/routes/+page.js` to fetch `/home` and `+page.svelte` to render home content.
- `/projects` uses `src/routes/projects/+page.server.js` to fetch `/projects` and `+page.svelte` to render the project grid and panel behavior.
- `/projects/[slug]` uses server loading with 404 handling and standalone article rendering.
- `/about` fetches `/about` and renders API-provided article content.
- `/contact` renders a contact form and posts data to `/send-email`.
- `/cv` is a server endpoint that redirects to the configured CV URL.
- `/sitemap.xml` proxies XML from the backend API.

## Component Patterns

- `MainLayout.svelte` wraps page content, imports global CSS, renders header/footer navigation, lazy loading, and the project detail panel container.
- `Seo.svelte` centralizes `<svelte:head>` title, description, author, and Open Graph tags.
- `PageHeader.svelte` provides reusable page heading presentation.
- `MessageBox.svelte` is used for user feedback on copy/contact actions.
- `LazyLoading.svelte` starts global lazy-loading behavior on mount in the browser.
- `LazyLoadingWrapper.svelte` wraps images with LQIP support.

## State Management

State is managed with Svelte writable stores in `src/store.js`:

```js
export const panelOpen = writable(false);
export const panelData = writable({content: ''});
export const settings = writable(null);
export const cache = writable(null);
export const theme = writable('light');
```

Global settings, panel state, and theme state are consumed across routes/components.

## Theme Pattern

- Tailwind dark mode is configured with `darkMode: 'class'` in `tailwind.config.cjs`.
- The active theme is represented by the `theme` writable store in `src/store.js`.
- `src/theme.js` exports:
  - `initTheme()` to read `localStorage.theme`, fall back to `prefers-color-scheme: dark`, apply the `dark` class to `<html>`, and update the store.
  - `toggleTheme()` to switch between `light` and `dark`, persist the choice, apply the class, and update the store.
- `src/app.html` contains a small inline script that applies the initial `<html class="dark">` state before Svelte hydrates, reducing theme flash.
- `MainLayout.svelte` initializes the theme on mount and renders the global `Light`/`Dark` pill switch in the header navigation. The switch uses `aria-label` and `aria-pressed` while reusing `toggleTheme()`.
- Component-level styling uses Tailwind `dark:*` variants where possible.
- Because the project uses Tailwind `^3.1.8`, use supported color shades such as `neutral-900`; do not use newer shades like `neutral-950` unless Tailwind is upgraded.
- Backend-rendered `{@html ...}` content is supported by global dark-mode CSS fallbacks in `src/style.css`, especially for article content, block image frames, gray text, borders, and nav/link underline colors.
- Global dark-mode background fallbacks are defined for `.dark`, `.dark body`, `.dark .content`, `.dark .content header`, and `.dark .inner-panel` to prevent light backgrounds from remaining when dark text styles apply.
- The wide-screen right sidebar is the body background revealed by the max-width `.content` wrapper with `mr-auto`. In dark mode, keep body background `#111111` and content background `#171717` so the sidebar remains visible.

## Panel Pattern

`src/panel.js` exports `usePanel()`, which provides `openPanel` and `closePanel`.

- Opening the panel:
  - Adds `html-panel` and `noscroll` classes to `document.body`.
  - Sets `document.title` from `panelDataValue.title`.
  - Sets `panelOpen` to `true`.
- Closing the panel:
  - Clears `panelData`.
  - Removes body classes.
  - Resets `panelOpen` to `false`.
  - Restores document title to `Projects | Armin Salihović`.

The projects route uses SvelteKit navigation hooks and browser history to intercept navigation to project detail routes and show details in the panel.

## API Integration Pattern

API calls use `PUBLIC_API_BASE_URL` from `$env/static/public` and SvelteKit `fetch`.

Common endpoints:

- `/settings`
- `/cache`
- `/home`
- `/about`
- `/projects`
- `/projects/:slug`
- `/send-email`
- `/sitemap.xml`

## Styling Pattern

- Tailwind CSS is configured in `tailwind.config.cjs` with class-based dark mode and content scanning over `./src/**/*.{html,js,svelte,ts}`.
- Custom screens:
  - `xs: 475px`
  - `3xl: 1921px`
  - `4xl: 2561px`
- Global styles are imported in `MainLayout.svelte` from `src/app.css` and `src/style.css`.
