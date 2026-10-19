import { localeFromPath } from './lib/locale.js';

export function transformHtmlLang(html, pathname) {
    const locale = localeFromPath(pathname);
    return html.replace('<html lang="en">', `<html lang="${locale}">`);
}

export async function handle({ event, resolve }) {
    return resolve(event, {
        transformPageChunk: ({ html }) => transformHtmlLang(html, event.url.pathname)
    });
}
