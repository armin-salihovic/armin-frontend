# System Patterns

## Architecture

- `src/lib/config/site.js` holds local social, SEO, favicon, URL, and CV settings.
- `src/lib/content/pages` holds Home and About block arrays.
- `src/lib/content/projects` holds the ordered project registry and self-contained project modules.
- `src/lib/blocks/BlockRenderer.svelte` maps the active structured block types to Svelte components.
- `src/lib/generated/images.js` maps static paths to image dimensions, aspect ratios, source hashes, and embedded LQIPs.
- `scripts/generate-image-metadata.mjs` uses `sharp` to keep metadata deterministic and generate WebP LQIPs for new or changed raster images.

## Routes and SEO

- Route loaders import local modules; they do not call Laravel.
- The dedicated project route validates the slug and throws a SvelteKit 404 when it is unknown.
- The project list panel and dedicated route both render `project.blocks` through `BlockRenderer`.
- `Seo.svelte` receives local page/project metadata and the route's canonical path.
- `/sitemap.xml` builds XML from the fixed public paths and canonical project registry.
- `/cv` redirects to the static CV file.

## State and UX

- `src/store.js` contains only `panelOpen`, `panelData`, and `theme`.
- `src/panel.js` controls panel body classes and title; the projects route retains its history behavior.
- `src/lazy-loading.js` and the lazy-loading components preserve blur placeholders, fade-in, and eager/lazy behavior.
- Theme initialization remains in `MainLayout.svelte`; Tailwind uses the existing class-based dark mode.

## Contact

- The browser submits to `/api/contact` only on form submission.
- The server validates inputs and honeypot, then calls the Resend API with server-only environment values.
- Missing provider configuration returns a structured 503 response.
