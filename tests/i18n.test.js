import test from 'node:test';
import assert from 'node:assert/strict';
import { localeFromPath, localizedPath, projectAvailableInLocale } from '../src/lib/locale.js';
import { localizedApiUrl } from '../src/lib/api-url.js';
import { translate } from '../src/lib/i18n.js';
import { isCurrentProjectRequest, loadSuccessfulProject, projectCacheKey, projectRequestError } from '../src/lib/project-panel.js';
import { transformHtmlLang } from '../src/hooks.server.js';
import { buildSitemapXml, canonicalUrl, createSitemapEntries, hasSitemapSourceFailure, isSitemapPayload, localizedAlternates } from '../src/lib/seo.js';

test('English routes remain unprefixed and German routes receive /de', () => {
    const paths = ['/', '/about', '/contact', '/projects', '/projects/pick-and-fix'];

    for (const path of paths) {
        assert.equal(localizedPath(path, 'en'), path);
        const germanPath = localizedPath(path, 'de');
        assert.equal(germanPath, path === '/' ? '/de' : `/de${path}`);
        assert.equal(localeFromPath(path), 'en');
        assert.equal(localeFromPath(germanPath), 'de');
        assert.equal(localizedPath(germanPath, 'en'), path);
    }
    assert.equal(localizedPath('/de/about', 'de'), '/de/about');
});

test('locale is derived only from the German route prefix', () => {
    assert.equal(localeFromPath('/'), 'en');
    assert.equal(localeFromPath('/projects/demo'), 'en');
    assert.equal(localeFromPath('/de'), 'de');
    assert.equal(localeFromPath('/de/'), 'de');
    assert.equal(localeFromPath('/de/about'), 'de');
    assert.equal(localeFromPath('/de/projects/demo'), 'de');
    assert.equal(localeFromPath('/deutsch/about'), 'en');
    assert.equal(localeFromPath('/de-DE/about'), 'en');
    assert.equal(localeFromPath('/en/about'), 'en');
    assert.equal(localeFromPath('/projects/de'), 'en');
});

test('SSR document language follows the route and rejects non-locale prefixes', () => {
    const html = '<!doctype html><html lang="en"><head></head><body></body></html>';
    assert.match(transformHtmlLang(html, '/'), /<html lang="en">/);
    assert.match(transformHtmlLang(html, '/de'), /<html lang="de">/);
    assert.match(transformHtmlLang(html, '/de/about'), /<html lang="de">/);
    assert.match(transformHtmlLang(html, '/deutsch/about'), /<html lang="en">/);
});

test('frontend translations are localized and missing keys fail loudly', () => {
    assert.equal(translate('en', 'nav.projects'), 'Projects');
    assert.equal(translate('de', 'nav.projects'), 'Projekte');
    assert.equal(translate('de', 'project.image', { title: 'Portfolio' }), 'Projektbild: Portfolio');
    assert.throws(() => translate('de', 'not.a.key'), /Missing translation/);
});

test('content and settings API requests include the route locale', () => {
    const base = 'https://api.example.test/api/';
    assert.equal(localizedApiUrl(base, '/home', 'en'), 'https://api.example.test/api/home?locale=en');
    assert.equal(localizedApiUrl(base, '/home', 'de'), 'https://api.example.test/api/home?locale=de');
    assert.equal(localizedApiUrl(base, '/about', 'de'), 'https://api.example.test/api/about?locale=de');
    assert.equal(localizedApiUrl(base, '/about', 'en'), 'https://api.example.test/api/about?locale=en');
    assert.equal(localizedApiUrl(base, '/projects', 'en'), 'https://api.example.test/api/projects?locale=en');
    assert.equal(localizedApiUrl(base, '/projects', 'de'), 'https://api.example.test/api/projects?locale=de');
    assert.equal(localizedApiUrl(base, '/settings', 'de'), 'https://api.example.test/api/settings?locale=de');
    assert.equal(localizedApiUrl(base, '/settings', 'en'), 'https://api.example.test/api/settings?locale=en');
    assert.equal(localizedApiUrl(base, '/projects/demo', 'en'), 'https://api.example.test/api/projects/demo?locale=en');
    assert.equal(localizedApiUrl(base, '/projects/demo', 'de'), 'https://api.example.test/api/projects/demo?locale=de');
});

test('canonical and Open Graph URL helpers keep the current page path', () => {
    assert.equal(canonicalUrl('/'), 'https://www.armin.ba/');
    assert.equal(canonicalUrl('/about/?preview=1'), 'https://www.armin.ba/about');
    assert.equal(canonicalUrl('/de/projects/pick-and-fix'), 'https://www.armin.ba/de/projects/pick-and-fix');
});

test('language alternates include only available translations', () => {
    assert.deepEqual(localizedAlternates('/projects/demo', ['en']), [
        {locale: 'en', url: 'https://www.armin.ba/projects/demo'}
    ]);
    assert.deepEqual(localizedAlternates('/de/projects/demo', ['de', 'en']), [
        {locale: 'en', url: 'https://www.armin.ba/projects/demo'},
        {locale: 'de', url: 'https://www.armin.ba/de/projects/demo'}
    ]);
});

test('language switching does not offer an unpublished project translation', () => {
    const projectSlugsByLocale = {en: ['english-only', 'shared-project'], de: ['shared-project']};
    assert.equal(projectAvailableInLocale('/projects/english-only', projectSlugsByLocale, 'de'), false);
    assert.equal(projectAvailableInLocale('/de/projects/shared-project', projectSlugsByLocale, 'en'), true);
    assert.equal(projectAvailableInLocale('/projects', projectSlugsByLocale, 'de'), null);
});

test('project panel caches only successful data and retries failures', async () => {
    const cache = new Map();
    const key = projectCacheKey('en', '/projects/demo');
    let attempts = 0;

    const failed = await loadSuccessfulProject(cache, key, async () => {
        attempts += 1;
        throw Object.assign(new Error('Temporary backend failure'), {status: 503});
    });
    assert.deepEqual(failed, {ok: false, status: 503});
    assert.equal(cache.has(key), false);

    const project = {title: 'Demo', content: '<p>Demo</p>'};
    const loaded = await loadSuccessfulProject(cache, key, async () => {
        attempts += 1;
        return project;
    });
    assert.deepEqual(loaded, {ok: true, project});
    assert.equal(cache.get(key), project);

    const cached = await loadSuccessfulProject(cache, key, async () => {
        attempts += 1;
        throw new Error('Cached project should not be loaded again');
    });
    assert.deepEqual(cached, {ok: true, project});
    assert.equal(attempts, 2);
    assert.notEqual(projectCacheKey('en', '/projects/demo'), projectCacheKey('de', '/projects/demo'));

    const invalid = await loadSuccessfulProject(cache, projectCacheKey('en', '/projects/empty'), async () => ({}));
    assert.deepEqual(invalid, {ok: false, status: 502});
    assert.equal(cache.has(projectCacheKey('en', '/projects/empty')), false);
});

test('project panel distinguishes 404 from transient failures with localized messages', () => {
    assert.deepEqual(projectRequestError('en', 404), {
        title: 'Page not found',
        message: "Sorry, the page you're looking for is unavailable."
    });
    assert.deepEqual(projectRequestError('de', 503), {
        title: 'Dieses Projekt ist derzeit nicht verfügbar.',
        message: 'Etwas ist schiefgelaufen. Bitte versuche es später erneut.'
    });
});

test('project panel request guard rejects stale IDs, paths, and locales', () => {
    const currentRequest = {
        requestId: 7,
        activeRequestId: 7,
        requestedPath: '/de/projects/demo',
        currentPath: '/de/projects/demo',
        requestedLocale: 'de',
        currentLocale: 'de'
    };
    assert.equal(isCurrentProjectRequest(currentRequest), true);
    assert.equal(isCurrentProjectRequest({...currentRequest, activeRequestId: 8}), false);
    assert.equal(isCurrentProjectRequest({...currentRequest, currentPath: '/de/projects/other'}), false);
    assert.equal(isCurrentProjectRequest({...currentRequest, currentLocale: 'en'}), false);
});

test('sitemap includes published project locales and reciprocal alternates without /en URLs', () => {
    const entries = createSitemapEntries({
        home: ['en', 'de'],
        about: ['en'],
        contact: ['en', 'de'],
        projects: ['en', 'de']
    }, {
        en: ['english-only', 'shared-project'],
        de: ['shared-project']
    });
    const xml = buildSitemapXml(entries);

    assert.match(xml, /<loc>https:\/\/www\.armin\.ba\/projects\/english-only<\/loc>/);
    assert.doesNotMatch(xml, /https:\/\/www\.armin\.ba\/de\/projects\/english-only/);
    assert.doesNotMatch(xml, /https:\/\/www\.armin\.ba\/de\/about/);
    assert.match(xml, /<loc>https:\/\/www\.armin\.ba\/de\/projects\/shared-project<\/loc>/);
    assert.match(xml, /hreflang="en" href="https:\/\/www\.armin\.ba\/projects\/shared-project"/);
    assert.match(xml, /hreflang="de" href="https:\/\/www\.armin\.ba\/de\/projects\/shared-project"/);
    assert.doesNotMatch(xml, /https:\/\/www\.armin\.ba\/en\//);
});

test('sitemap generation distinguishes missing translations from API outages', () => {
    const missingGermanTranslation = {status: 404, available: false};
    const missingEnglishPage = {status: 404, available: false};
    const apiOutage = {status: 0, available: false};
    assert.equal(hasSitemapSourceFailure({en: {home: {status: 200, available: true}}, de: {home: missingGermanTranslation}}), false);
    assert.equal(hasSitemapSourceFailure({en: {home: missingEnglishPage}, de: {home: missingGermanTranslation}}), true);
    assert.equal(hasSitemapSourceFailure({en: {home: {status: 200, available: true}}, de: {home: apiOutage}}), true);
});

test('sitemap accepts only API payload shapes required by the route loaders', () => {
    assert.equal(isSitemapPayload('/home', {data: {title: 'Home', content: '<p>Hi</p>'}}), true);
    assert.equal(isSitemapPayload('/about', {data: {content: '<p>About</p>'}}), true);
    assert.equal(isSitemapPayload('/about', {data: {title: 'About'}}), false);
    assert.equal(isSitemapPayload('/projects', {data: [{slug: 'demo'}]}), true);
    assert.equal(isSitemapPayload('/projects', {data: [{title: 'Missing slug'}]}), false);
});
