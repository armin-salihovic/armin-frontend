export async function load({ url }) {
    return { locale: /^\/de(?:\/|$)/.test(url.pathname) ? 'de' : 'en' };
}
