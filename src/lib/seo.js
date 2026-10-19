import { localizedPath } from './locale.js';

export const CANONICAL_SITE_ORIGIN = 'https://www.armin.ba';

export function normalizeCanonicalPath(pathname) {
    const path = String(pathname || '/').split(/[?#]/, 1)[0] || '/';
    const absolutePath = path.startsWith('/') ? path : `/${path}`;
    return absolutePath.length > 1 ? absolutePath.replace(/\/+$/, '') : '/';
}

export function canonicalUrl(pathname, origin = CANONICAL_SITE_ORIGIN) {
    return new URL(normalizeCanonicalPath(pathname), `${origin.replace(/\/$/, '')}/`).toString();
}

export function localizedAlternates(pathname, locales, origin = CANONICAL_SITE_ORIGIN) {
    const available = new Set((locales || []).filter((locale) => locale === 'en' || locale === 'de'));
    return ['en', 'de']
        .filter((locale) => available.has(locale))
        .map((locale) => ({
            locale,
            url: canonicalUrl(localizedPath(pathname, locale), origin)
        }));
}

export function createSitemapEntries(pageLocales, projectSlugsByLocale) {
    const entries = [];
    const pages = {
        home: '/',
        about: '/about',
        contact: '/contact',
        projects: '/projects'
    };

    for (const [key, path] of Object.entries(pages)) {
        for (const locale of pageLocales[key] || []) {
            if (locale === 'en' || locale === 'de') {
                entries.push({ key, locale, path: localizedPath(path, locale) });
            }
        }
    }

    const projectSlugs = new Set([
        ...(projectSlugsByLocale.en || []),
        ...(projectSlugsByLocale.de || [])
    ]);

    for (const slug of projectSlugs) {
        if (typeof slug !== 'string' || !slug.trim()) continue;
        const key = `project:${slug}`;
        for (const locale of ['en', 'de']) {
            if ((projectSlugsByLocale[locale] || []).includes(slug)) {
                const path = `/projects/${encodeURIComponent(slug)}`;
                entries.push({ key, locale, path: localizedPath(path, locale) });
            }
        }
    }

    return entries;
}

export function hasSitemapSourceFailure(apiData, locales = ['en', 'de']) {
    return locales.some((locale) => Object.values(apiData[locale] || {})
        .some((response) => !response.available && (locale === 'en' || response.status !== 404)));
}

export function isSitemapPayload(endpoint, payload) {
    if (endpoint === '/projects') {
        return Array.isArray(payload?.data) && payload.data.every((project) =>
            project && typeof project.slug === 'string' && Boolean(project.slug.trim())
        );
    }

    return typeof payload?.data?.content === 'string';
}

function escapeXml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export function buildSitemapXml(entries, origin = CANONICAL_SITE_ORIGIN) {
    const grouped = new Map();
    for (const entry of entries) {
        const key = `${entry.key}:${entry.locale}`;
        if (!grouped.has(key)) grouped.set(key, entry);
    }

    const alternatesByPage = new Map();
    for (const entry of grouped.values()) {
        const alternates = alternatesByPage.get(entry.key) || [];
        alternates.push({ locale: entry.locale, url: canonicalUrl(entry.path, origin) });
        alternatesByPage.set(entry.key, alternates);
    }

    const seen = new Set();
    const urls = [];
    for (const entry of grouped.values()) {
        const url = canonicalUrl(entry.path, origin);
        if (seen.has(url)) continue;
        seen.add(url);

        const alternateLinks = (alternatesByPage.get(entry.key) || [])
            .map(({ locale, url: alternateUrl }) => `    <xhtml:link rel="alternate" hreflang="${locale}" href="${escapeXml(alternateUrl)}" />`)
            .join('\n');
        urls.push(`  <url>\n    <loc>${escapeXml(url)}</loc>${alternateLinks ? `\n${alternateLinks}` : ''}\n  </url>`);
    }

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
}
