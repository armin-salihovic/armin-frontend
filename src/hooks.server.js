import { localeFromPath } from './lib/locale.js';

export async function handle({ event, resolve }) {
    const locale = localeFromPath(event.url.pathname);

    return resolve(event, {
        transformPageChunk: ({ html }) => html.replace('<html lang="en">', `<html lang="${locale}">`)
    });
}
