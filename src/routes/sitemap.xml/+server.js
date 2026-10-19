import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { localizedApiUrl } from '$lib/api-url.js';
import { buildSitemapXml, createSitemapEntries, hasSitemapSourceFailure, isSitemapPayload } from '$lib/seo.js';

const locales = ['en', 'de'];

async function getApiPayload(fetchFn, endpoint, locale) {
    let status = 0;
    try {
        const response = await fetchFn(localizedApiUrl(PUBLIC_API_BASE_URL, endpoint, locale), {
            redirect: 'manual'
        });
        status = response.status;
        if (!response.ok || response.redirected) return {status, available: false, payload: null};
        try {
            const payload = await response.json();
            return isSitemapPayload(endpoint, payload)
                ? {status, available: true, payload}
                : {status: 502, available: false, payload: null};
        } catch {
            return {status: 502, available: false, payload: null};
        }
    } catch {
        return {status, available: false, payload: null};
    }
}

function projectSlugs(response) {
    const payload = response?.payload;
    if (!Array.isArray(payload?.data)) return [];
    return [...new Set(payload.data
        .map((project) => project?.slug)
        .filter((slug) => typeof slug === 'string' && slug.trim()))];
}

export async function GET({ fetch }) {
    const pageEndpoints = {
        home: '/home',
        about: '/about',
        projects: '/projects'
    };
    const requests = await Promise.all(locales.map(async (locale) => {
        const payloads = await Promise.all(Object.entries(pageEndpoints).map(async ([key, endpoint]) => [
            key,
            await getApiPayload(fetch, endpoint, locale)
        ]));
        return [locale, Object.fromEntries(payloads)];
    }));
    const apiData = Object.fromEntries(requests);
    if (hasSitemapSourceFailure(apiData, locales)) {
        return new Response('Sitemap source temporarily unavailable.', {
            status: 503,
            headers: {'Cache-Control': 'no-store'}
        });
    }

    const pageLocales = {
        home: locales.filter((locale) => apiData[locale].home.available),
        about: locales.filter((locale) => apiData[locale].about.available),
        contact: locales,
        projects: locales.filter((locale) => apiData[locale].projects.available)
    };
    const projectSlugsByLocale = Object.fromEntries(locales.map((locale) => [
        locale,
        projectSlugs(apiData[locale].projects)
    ]));
    const xml = buildSitemapXml(createSitemapEntries(pageLocales, projectSlugsByLocale));

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=300, s-maxage=300'
        }
    });
}
