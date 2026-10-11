# armin.ba frontend

This SvelteKit app keeps public page and project content in `src/lib/content`, settings in `src/lib/config/site.js`, and images/CV in `static/`. It has no runtime dependency on the Laravel CMS.

## Develop and build

```bash
npm run dev
npm run build
npm run preview
```

## Add images

1. Add the prepared desktop or mobile image under `static/`.
2. Run `npm run images` to update `src/lib/generated/images.js` with dimensions, aspect ratio, and an embedded base64 WebP LQIP.
3. Commit the image and generated metadata together.

Existing migrated images retain their original Twill LQIPs when the image bytes have not changed. The script only generates metadata and placeholders; crop variants remain explicit files.

## Contact delivery on Cloudflare Pages

The `/api/contact` endpoint sends through the Resend HTTP API. Add these server-side Cloudflare Pages environment values:

- `RESEND_API_KEY` as a secret.
- `CONTACT_EMAIL_FROM` as a sender address verified with the provider.
- `CONTACT_EMAIL_TO` as the inbox that receives messages (the current site contact address is `hello@armin.ba`).

The endpoint returns a structured 503 until these values are configured. No email credentials belong in `PUBLIC_*` variables.
