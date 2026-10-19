import { localizedApiJson } from './lib/api.js';
import { localeFromPath } from './lib/locale.js';

export async function getSettings({ fetch, url }, localeOverride) {
    const locale = localeOverride || (url ? localeFromPath(url.pathname) : 'en');
    return localizedApiJson(fetch, '/settings', locale);
}
