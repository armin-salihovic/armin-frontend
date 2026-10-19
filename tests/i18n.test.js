import test from 'node:test';
import assert from 'node:assert/strict';
import { localeFromPath, localizedPath } from '../src/lib/locale.js';
import { localizedApiUrl } from '../src/lib/api-url.js';
import { translate } from '../src/lib/i18n.js';
import { transformHtmlLang } from '../src/hooks.server.js';

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
