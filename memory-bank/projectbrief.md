# Project Brief

## Purpose

Build and maintain a frontend-only SvelteKit portfolio for Armin Salihović.

## Core Requirements

- Preserve the current visual design, responsive layout, navigation, project panel, dark mode, lazy loading, and SEO.
- Store Home/About blocks, site settings, and the five canonical projects in JavaScript modules.
- Serve current images and the active CV from local static assets.
- Generate local sitemap XML for the public canonical routes.
- Return proper 404 responses for unknown project slugs; do not support historical aliases.
- Send contact form submissions to same-origin `/api/contact`, validating all fields on the server and keeping provider credentials private.
- Generate image dimensions, aspect ratios, and embedded base64 LQIPs with `npm run images`.
- Keep the existing Svelte/SvelteKit/Tailwind/Vite versions and JavaScript implementation.

## Deployment

The project targets Cloudflare Pages. Configure `RESEND_API_KEY`, `CONTACT_EMAIL_FROM`, and `CONTACT_EMAIL_TO` as server-side environment values before enabling contact delivery.
