import {translate} from './i18n.js';

export function projectCacheKey(locale, path) {
    return `${locale}:${path}`;
}

export function projectSlugsForPanel(locale, slug, availableLocales = [locale]) {
    const otherLocale = locale === 'de' ? 'en' : 'de';
    return {
        [locale]: [slug],
        [otherLocale]: availableLocales.includes(otherLocale) ? [slug] : []
    };
}

export function isProjectPanelData(project) {
    return Boolean(project) &&
        typeof project === 'object' &&
        !Array.isArray(project) &&
        typeof project.title === 'string' &&
        typeof project.content === 'string';
}

export function projectLocalesFromAvailabilityResponse(locale, response) {
    if (response?.status === 404) return [locale];
    if (!response?.ok || response.redirected || !isProjectPanelData(response.payload?.data)) return null;

    const otherLocale = locale === 'de' ? 'en' : 'de';
    return [locale, otherLocale];
}

export async function loadSuccessfulProject(cache, key, loadProject) {
    if (cache.has(key)) {
        return {ok: true, project: cache.get(key)};
    }

    try {
        const project = await loadProject();
        if (!isProjectPanelData(project)) {
            return {ok: false, status: 502};
        }

        cache.set(key, project);
        return {ok: true, project};
    } catch (error) {
        return {ok: false, status: Number(error?.status) || 0};
    }
}

export async function loadProjectWithAvailability({
    cache,
    key,
    loadProject,
    loadAvailability
}) {
    const result = await loadSuccessfulProject(cache, key, loadProject);
    if (!result.ok) return result;

    const availability = Promise.resolve()
        .then(loadAvailability)
        .then((locales) => {
            if (!Array.isArray(locales) || locales.length === 0) return null;
            return locales;
        })
        .catch(() => null);

    return {...result, availability};
}

export async function openProjectPanelAfterLoad({
    loadProject,
    isCurrent,
    updateHistory,
    onError,
    onProject,
    openPanel
}) {
    const result = await loadProject();
    if (!isCurrent('before-history')) return {ok: false, stale: true};

    if (!result.ok) {
        onError(result);
        openPanel();
        return result;
    }

    updateHistory();
    if (!isCurrent('after-history')) return {ok: false, stale: true};

    onProject(result.project);
    openPanel();
    return result;
}

export function isCurrentProjectRequest({
    requestId,
    activeRequestId,
    requestedPath,
    currentPath,
    requestedLocale,
    currentLocale
}) {
    return requestId === activeRequestId &&
        requestedPath === currentPath &&
        requestedLocale === currentLocale;
}

export function projectRequestError(locale, status) {
    const notFound = status === 404;
    return {
        title: translate(locale, notFound ? 'error.notFoundTitle' : 'project.unavailable'),
        message: translate(locale, notFound ? 'error.notFoundMessage' : 'error.genericMessage')
    };
}

export function canRetryProjectRequest(status) {
    return status === 0 || status === 408 || status === 429 || status >= 500;
}
