import { error } from '@sveltejs/kit';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { translate } from './i18n.js';
import { localeFromPath } from './locale.js';
import { localizedApiUrl } from './api-url.js';

export async function localizedApiFetch(fetchFn, endpoint, locale, options = {}) {
    return fetchFn(localizedApiUrl(PUBLIC_API_BASE_URL, endpoint, locale), options);
}

export async function localizedApiJson(fetchFn, endpoint, locale) {
    const response = await localizedApiFetch(fetchFn, endpoint, locale);
    if (!response.ok) {
        const status = response.status || 502;
        const message = status === 404
            ? translate(locale, 'error.notFoundMessage')
            : translate(locale, 'error.genericMessage');
        throw error(status, message);
    }

    return response.json();
}

export async function loadLocalizedContent({ fetch, url }, endpoint) {
    const locale = localeFromPath(url.pathname);
    return {
        ...(await localizedApiJson(fetch, endpoint, locale)),
        locale
    };
}
