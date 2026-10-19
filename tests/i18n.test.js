import test from 'node:test';
import assert from 'node:assert/strict';
import { localeFromPath, localizedPath } from '../src/lib/locale.js';
import { localizedApiUrl } from '../src/lib/api-url.js';
import { translate } from '../src/lib/i18n.js';

test('English routes remain unprefixed and German routes receive /de', () => {
    const paths = ['/', '/about', '/contact', '/projects', '/projects/pick-and-fix'];

    for (const path of paths) {
        assert.equal(localizedPath(path, 'en'), path);
        assert.equal(localizedPath(path, 'de'), path === '/' ? '/de' : `/de${path}`);
    }
});

test('locale is derived only from the German route prefix', () => {
    assert.equal(localeFromPath('/'), 'en');
    assert.equal(localeFromPath('/projects/demo'), 'en');
    assert.equal(localeFromPath('/de'), 'de');
    assert.equal(localeFromPath('/de/projects/demo'), 'de');
    assert.equal(localeFromPath('/deutsch/about'), 'en');
});

test('frontend translations are localized and missing keys fail loudly', () => {
    assert.equal(translate('en', 'nav.projects'), 'Projects');
    assert.equal(translate('de', 'nav.projects'), 'Projekte');
    assert.equal(translate('de', 'project.image', { title: 'Portfolio' }), 'Projektbild: Portfolio');
    assert.throws(() => translate('de', 'not.a.key'), /Missing translation/);
});

test('content and settings API requests include the route locale', () => {
    const base = 'https://api.example.test/api/';
    assert.equal(localizedApiUrl(base, '/about', 'de'), 'https://api.example.test/api/about?locale=de');
    assert.equal(localizedApiUrl(base, '/projects', 'de'), 'https://api.example.test/api/projects?locale=de');
    assert.equal(localizedApiUrl(base, '/settings', 'de'), 'https://api.example.test/api/settings?locale=de');
    assert.equal(localizedApiUrl(base, '/projects/demo', 'en'), 'https://api.example.test/api/projects/demo?locale=en');
});
