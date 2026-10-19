export function localizedApiUrl(apiBase, endpoint, locale) {
    const base = apiBase.replace(/\/$/, '');
    const url = new URL(`${base}/${endpoint.replace(/^\//, '')}`);
    url.searchParams.set('locale', locale);
    return url.toString();
}
