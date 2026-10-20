<script>
    import PageHeader from "../../components/PageHeader.svelte";
    import MainLayout from "../../components/MainLayout.svelte";
    import {afterUpdate, onDestroy, onMount} from "svelte";
    import {page} from "$app/stores";
    import {usePanel} from "../../panel.js";
    import {panelData, panelOpen} from "../../store.js";
    import Seo from "../../components/Seo.svelte";
    import LazyLoadingWrapper from "../../components/LazyLoadingWrapper.svelte";
    import {useLazyLoading} from "../../lazy-loading.js";
    import {localizedApiJson, localizedAvailability} from '../../lib/api.js';
    import {localizedPath} from '../../lib/locale.js';
    import {translate} from '../../lib/i18n.js';
    import {canRetryProjectRequest, isCurrentProjectRequest, loadProjectWithAvailability, openProjectPanelAfterLoad, projectCacheKey, projectRequestError, projectSlugsForPanel} from '../../lib/project-panel.js';

    /** @type {import('./$types').PageData} */
    export let data;

    let activeProjectSlug = null;
    let activeProject = null;
    let activeProjectError = null;
    let activeProjectRequest = 0;
    let previousLocale;

    $: locale = data.locale || $page.data.locale || 'en';
    $: settings = $page.data.settings || {};
    $: panelProjectSlugsByLocale = activeProjectSlug
        ? projectSlugsForPanel(locale, activeProjectSlug, activeProject?.availableLocales || [locale])
        : null;
    const {closePanel, openPanel} = usePanel();
    const lazyLoading = useLazyLoading();
    const projectCache = new Map();
    const availabilityCache = new Map();

    $: if (previousLocale && previousLocale !== locale) {
        activeProjectRequest += 1;
        activeProjectSlug = null;
        activeProject = null;
        activeProjectError = null;
        closePanel(translate(locale, 'nav.projects'));
    }
    $: previousLocale = locale;

    async function getProject(path, requestLocale) {
        const key = projectCacheKey(requestLocale, path);
        return loadProjectWithAvailability({
            cache: projectCache,
            key,
            loadProject: async () => {
                const response = await localizedApiJson(fetch, path, requestLocale);
                return response.data;
            },
            loadAvailability: async () => {
                if (availabilityCache.has(key)) return availabilityCache.get(key);
                const availableLocales = await localizedAvailability(fetch, path, requestLocale);
                if (availableLocales?.length > 1) availabilityCache.set(key, availableLocales);
                return availableLocales;
            }
        });
    }

    async function showProject(path, requestLocale = locale, options = {}) {
        const requestId = ++activeProjectRequest;
        const requestedPath = localizedPath(`/projects/${encodeURIComponent(path)}`, requestLocale);
        const projectPath = `/projects/${encodeURIComponent(path)}`;
        const expectedPath = options.expectedPath || window.location.pathname;

        activeProjectSlug = path;
        activeProject = null;
        activeProjectError = null;

        const key = projectCacheKey(requestLocale, projectPath);
        const result = await openProjectPanelAfterLoad({
            loadProject: () => getProject(projectPath, requestLocale),
            isCurrent: (stage) => isCurrentProjectRequest({
                requestId,
                activeRequestId: activeProjectRequest,
                requestedPath: stage === 'before-history' ? expectedPath : requestedPath,
                currentPath: window.location.pathname,
                requestedLocale: requestLocale,
                currentLocale: locale
            }),
            updateHistory: () => {
                if (!options.pushHistory || window.location.pathname !== expectedPath) return;
                window.history.pushState(window.history.state, '', requestedPath);
                window.dispatchEvent(new Event('app-path-change'));
            },
            onError: (projectResult) => {
                activeProjectError = {
                    ...projectRequestError(requestLocale, projectResult.status),
                    status: projectResult.status,
                    retryable: canRetryProjectRequest(projectResult.status)
                };
                panelData.set({title: activeProjectError.title, content: ''});
            },
            onProject: (project) => {
                activeProject = {
                    ...project,
                    availableLocales: availabilityCache.get(key) || [requestLocale]
                };
                panelData.set(activeProject);
            },
            openPanel
        });
        if (!result.ok) return;

        void result.availability?.then((availableLocales) => {
            if (!availableLocales || !isCurrentProjectRequest({
                requestId,
                activeRequestId: activeProjectRequest,
                requestedPath,
                currentPath: window.location.pathname,
                requestedLocale: requestLocale,
                currentLocale: locale
            }) || activeProjectSlug !== path || !activeProject) return;

            activeProject = {...activeProject, availableLocales};
        });
    }

    async function openProject(event, slug) {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        const requestLocale = locale;
        const nextPath = localizedPath(`/projects/${encodeURIComponent(slug)}`, requestLocale);
        void showProject(slug, requestLocale, {
            expectedPath: window.location.pathname,
            pushHistory: window.location.pathname !== nextPath
        });
    }

    async function syncHistory() {
        const listPath = localizedPath('/projects', locale);
        const pathname = window.location.pathname;
        if (pathname.startsWith(`${listPath}/`)) {
            let slug;
            try {
                slug = decodeURIComponent(pathname.slice(listPath.length + 1));
            } catch {
                slug = null;
            }
            if (slug && !slug.includes('/')) {
                await showProject(slug, locale, {expectedPath: pathname});
            } else {
                resetPanelForList();
            }
        } else if (pathname === listPath || pathname === `${listPath}/`) {
            resetPanelForList();
        } else {
            resetPanelForList();
        }
    }

    function resetPanelForList() {
        activeProjectRequest += 1;
        activeProjectSlug = null;
        activeProject = null;
        activeProjectError = null;
        closePanel(translate(locale, 'nav.projects'));
    }

    function retryCurrentProject() {
        if (!activeProjectSlug) return;
        const slug = activeProjectSlug;
        const currentPath = window.location.pathname;
        const requestedPath = localizedPath(`/projects/${encodeURIComponent(slug)}`, locale);
        window.dispatchEvent(new Event('app-project-panel-close'));
        closePanel(translate(locale, 'nav.projects'));
        void showProject(slug, locale, {
            expectedPath: currentPath,
            pushHistory: currentPath !== requestedPath
        });
    }

    function cancelCurrentProjectRequest() {
        activeProjectRequest += 1;
    }

    onMount(() => {
        document.body.classList.add('relative');
        window.addEventListener('popstate', syncHistory);
        window.addEventListener('app-project-panel-close', cancelCurrentProjectRequest);
        if (window.location.pathname.startsWith(`${localizedPath('/projects', locale)}/`)) {
            syncHistory();
        }
        return () => {
            window.removeEventListener('popstate', syncHistory);
            window.removeEventListener('app-project-panel-close', cancelCurrentProjectRequest);
        };
    });

    onDestroy(() => {
        activeProjectRequest += 1;
        closePanel(translate(locale, 'nav.projects'));
    });

    afterUpdate(() => {
        if ($panelOpen) {
            lazyLoading.start();
        }
    })
</script>
<MainLayout projectSlugsByLocaleOverride={panelProjectSlugsByLocale}>
    <div class="p-6 sm:px-12 3xl:px-16 4xl:px-24">
        <Seo
            title={activeProject ? `${activeProject.title} | Armin Salihović` : settings['projects_meta_title']}
            metaDescription={activeProject ? activeProject.description : settings['projects_meta_description']}
            ogImg={activeProject ? activeProject.image : settings['projects_og']}
            availableLocales={activeProject ? activeProject.availableLocales : data.availableLocales}
            pathname={activeProject ? localizedPath(`/projects/${encodeURIComponent(activeProjectSlug)}`, locale) : undefined}
        />
        <PageHeader title={translate(locale, 'nav.projects')} />
        <article class="projects-list leading-normal grid grid-cols-1 lg:grid-cols-2 gap-10 3xl:gap-12 4xl:gap-20 pb-10 3xl:pb-12 4xl:pb-20">
            {#each data['data'] as project}
                <a href={localizedPath(`/projects/${encodeURIComponent(project.slug)}`, locale)} on:click={(event) => openProject(event, project.slug)}>
                    <LazyLoadingWrapper class="hidden lg:block mb-3 3xl:mb-4 4xl:mb-6" lqip="{project['image_lqpi']}">
                        <img
                            src="{project['image']}"
                            alt={translate(locale, 'project.image', {title: project.title})}
                            style="aspect-ratio:{project['aspect_ratio']};"
                            loading="lazy"
                        >
                    </LazyLoadingWrapper>
                    <LazyLoadingWrapper class="lg:hidden mb-3 3xl:mb-4 4xl:mb-6" lqip="{project['image_lqpi_mobile']}">
                        <img
                            src="{project['image_mobile']}"
                            alt={translate(locale, 'project.image', {title: project.title})}
                            style="aspect-ratio:1/1;"
                            loading="lazy"
                        >
                    </LazyLoadingWrapper>
                    <h2 class="fw-400 text-base md:text-lg 3xl:text-2xl 4xl:text-3xl">{ project.title }</h2>
                    <div class="flex gap-2 3xl:gap-2.5 4xl:gap-4 text-base md:text-lg 3xl:text-2xl 4xl:text-3xl flex-wrap leading-none">
                        {#each project['technologies'] as technology, index}
                                <p class="text-gray-500 dark:text-[#9e9589] whitespace-nowrap">{ technology }{#if index !== project.technologies.length-1 },{/if}</p>
                        {/each}
                    </div>
                </a>
            {/each}
            <div class="odd:hidden even:flex justify-center items-center">
                <LazyLoadingWrapper lqip="" class="hidden lg:block mb-3 3xl:mb-4 4xl:mb-6">
                    <img class="dark:invert" alt="" src="/img/logo_4.3.1_favicon_1.0.svg" style="height: 86px; aspect-ratio: 1/1"/>
                </LazyLoadingWrapper>
            </div>
        </article>
    </div>
    <span slot="panel-title">{$panelData.title}</span>
    <article class="article-content" slot="panel">
        {#if activeProjectError}
            <div role="alert" aria-live="assertive">
                <p>{activeProjectError.message}</p>
                {#if activeProjectError.retryable}
                    <button type="button" class="mt-4 underline underline-offset-4" on:click={retryCurrentProject}>
                        {translate(locale, 'project.retry')}
                    </button>
                {/if}
            </div>
        {:else}
            {@html $panelData.content}
        {/if}
    </article>
</MainLayout>
