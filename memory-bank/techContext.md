# Tech Context

## Runtime and Tooling

- Svelte `^3.44.0`
- SvelteKit `next` as pinned in the existing lockfile
- Vite `^3.1.0`
- Tailwind CSS `^3.1.8`
- `svelte-preprocess` `^4.10.7`
- `sharp` as a dev dependency for image metadata generation
- JavaScript modules; no TypeScript migration

## Scripts

- `npm run dev` starts Vite/SvelteKit.
- `npm run build` produces the current SvelteKit build.
- `npm run preview` previews the build.
- `npm run images` updates generated image metadata and LQIPs.

## Configuration and Constraints

- `svelte.config.js` keeps the existing adapter-auto setup and PostCSS preprocess configuration.
- Cloudflare Pages selects the bundled adapter-auto Cloudflare target in its deployment environment.
- Contact settings are server-only: `RESEND_API_KEY`, `CONTACT_EMAIL_FROM`, `CONTACT_EMAIL_TO`.
- Do not add a CMS, database/runtime content API, or framework/tooling upgrades as part of routine content changes.
