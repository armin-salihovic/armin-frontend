# Tech Context

## Core Technologies

- Svelte `^3.44.0`
- SvelteKit `next`
- Vite `^3.1.0`
- Tailwind CSS `^3.1.8`
- PostCSS `^8.4.18`
- Autoprefixer `^10.4.12`
- `svelte-preprocess` `^4.10.7`
- `@sveltejs/adapter-auto` `next`

## Package Configuration

Project is private and ESM-based:

```json
{
  "name": "armin-frontend",
  "private": true,
  "type": "module"
}
```

Available scripts:

- `npm run dev` → `vite dev`
- `npm run build` → `vite build`
- `npm run preview` → `vite preview`

No lint, format, or test scripts are currently configured.

## Environment

The frontend requires `PUBLIC_API_BASE_URL` for API requests. `.env.example` exists but was not inspected during initialization. Any local development or build requiring API data should define this variable.

## Configuration Files

- `svelte.config.js`
  - Uses `@sveltejs/adapter-auto`.
  - Enables `svelte-preprocess` with PostCSS.
- `vite.config.js`
  - Uses the SvelteKit Vite plugin.
- `tailwind.config.cjs`
  - Scans Svelte/JS/HTML/TS files under `src`.
  - Adds custom breakpoints.
- `postcss.config.cjs`
  - Uses Tailwind CSS and autoprefixer.

## Development Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Technical Constraints

- Backend API availability and response shape are required for normal rendering.
- The project uses older SvelteKit `next` package versions, so be careful applying current SvelteKit documentation without checking compatibility.
- Browser-specific APIs such as `navigator.clipboard`, `document`, `window`, and `onpopstate` are used in client-side contexts.
- Project article content is injected with `{@html ...}`, so backend content must be trusted/sanitized upstream.
