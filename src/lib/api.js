import { error } from '@sveltejs/kit';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { translate } from './i18n.js';
import { localeFromPath } from './locale.js';
import { localizedApiUrl } from './api-url.js';
import { projectLocalesFromAvailabilityResponse } from './project-panel.js';

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

async function localizedCounterpart(fetchFn, endpoint, locale) {
    const otherLocale = locale === 'de' ? 'en' : 'de';
    try {
        const response = await localizedApiFetch(fetchFn, endpoint, otherLocale);
        if (!response.ok || response.redirected) return null;
        return await response.json();
    } catch {
        return null;
    }
}

export async function localizedAvailability(fetchFn, endpoint, locale) {
    try {
        const response = await localizedApiFetch(fetchFn, endpoint, locale === 'de' ? 'en' : 'de');
        const payload = response.ok ? await response.json() : null;
        return projectLocalesFromAvailabilityResponse(locale, {
            status: response.status,
            ok: response.ok,
            redirected: response.redirected,
            payload
        });
    } catch {
        return null;
    }
}

function projectSlugs(payload) {
    if (!Array.isArray(payload?.data)) return [];
    return [...new Set(payload.data
        .map((project) => project?.slug)
        .filter((slug) => typeof slug === 'string' && slug.trim()))];
}

export async function loadLocalizedContent({ fetch, url }, endpoint) {
    const locale = localeFromPath(url.pathname);
    const otherLocale = locale === 'de' ? 'en' : 'de';
    const [content, counterpart] = await Promise.all([
        localizedApiJson(fetch, endpoint, locale),
        localizedCounterpart(fetch, endpoint, locale)
    ]);
    const availableLocales = counterpart === null ? [locale] : [locale, otherLocale];
    const result = {
        ...content,
        locale,
        availableLocales
    };

    if (endpoint === '/projects') {
        result.projectSlugsByLocale = {
            [locale]: projectSlugs(content),
            [otherLocale]: projectSlugs(counterpart)
        };
    }

    return result;
}

export async function loadLocalizedProject({ params, fetch, url }) {
    const locale = localeFromPath(url.pathname);
    const otherLocale = locale === 'de' ? 'en' : 'de';
    const endpoint = `/projects/${encodeURIComponent(params.slug)}`;
    const [content, counterpart] = await Promise.all([
        localizedApiJson(fetch, endpoint, locale),
        localizedCounterpart(fetch, endpoint, locale)
    ]);
    const availableLocales = counterpart === null ? [locale] : [locale, otherLocale];
    return {
        ...content,
        locale,
        availableLocales,
        projectSlugsByLocale: {
            [locale]: [params.slug],
            [otherLocale]: counterpart === null ? [] : [params.slug]
        }
    };
}
