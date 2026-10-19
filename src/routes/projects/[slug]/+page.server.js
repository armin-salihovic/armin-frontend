import { localizedApiJson } from '../../../lib/api.js';
import { localeFromPath } from '../../../lib/locale.js';

export async function load({ params, fetch, url }) {
    const locale = localeFromPath(url.pathname);
    return {
        ...(await localizedApiJson(fetch, `/projects/${encodeURIComponent(params.slug)}`, locale)),
        locale
    };
}
