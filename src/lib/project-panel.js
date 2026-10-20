import {translate} from './i18n.js';

export function projectCacheKey(locale, path) {
    return `${locale}:${path}`;
}

export function isProjectPanelData(project) {
    return Boolean(project) &&
        typeof project === 'object' &&
        !Array.isArray(project) &&
        typeof project.title === 'string' &&
        typeof project.content === 'string';
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
