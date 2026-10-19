import { localizedApiJson } from '../lib/api.js';
import { localeFromPath } from '../lib/locale.js';

export async function load({ fetch, url }) {
    const locale = localeFromPath(url.pathname);
    const settings = await localizedApiJson(fetch, '/settings', locale);

    return { locale, settings };
}
