export function localeFromPath(pathname) {
    return /^\/de(?:\/|$)/.test(pathname) ? 'de' : 'en';
}

export function localizedPath(pathname, locale) {
    const unprefixed = pathname.replace(/^\/de(?=\/|$)/, '') || '/';
    if (locale === 'de') return unprefixed === '/' ? '/de' : `/de${unprefixed}`;
    return unprefixed;
}
