export function localeFromPath(pathname) {
    return /^\/de(?:\/|$)/.test(pathname) ? 'de' : 'en';
}

export function localizedPath(pathname, locale) {
    const unprefixed = pathname.replace(/^\/de(?=\/|$)/, '') || '/';
    if (locale === 'de') return unprefixed === '/' ? '/de' : `/de${unprefixed}`;
    return unprefixed;
}

export function projectAvailableInLocale(pathname, projectSlugsByLocale, locale) {
    const match = String(pathname).match(/^\/(?:de\/)?projects\/([^/]+)\/?$/);
    if (!match) return null;

    let slug = match[1];
    try {
        slug = decodeURIComponent(slug);
    } catch {
        return false;
    }

    return Array.isArray(projectSlugsByLocale?.[locale]) && projectSlugsByLocale[locale].includes(slug);
}
