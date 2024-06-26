<script>
    import PageHeader from "../../components/PageHeader.svelte";
    import MainLayout from "../../components/MainLayout.svelte";
    import {beforeNavigate} from "$app/navigation";
    import {afterUpdate, onMount} from "svelte";
    import {page} from "$app/stores";
    import {browser} from "$app/environment";
    import {usePanel} from "../../panel.js";
    import {panelData, panelOpen, settings} from "../../store.js";
    import Seo from "../../components/Seo.svelte";
    import {PUBLIC_API_BASE_URL} from '$env/static/public';
    import LazyLoadingWrapper from "../../components/LazyLoadingWrapper.svelte";
    import {useLazyLoading} from "../../lazy-loading.js";

    /** @type {import('./$types').PageData} */
    export let data;

    let projects = [];

    if(browser) { document.body.classList.add('relative') }

    const {closePanel, openPanel} = usePanel();
    const lazyLoading = useLazyLoading();

    async function getProject(path) {
        let project = projects.find((project) => project.path === path);

        if(project) {
            return project;
        }

        try {
            const projectReq = await fetch(`${PUBLIC_API_BASE_URL}${path}`);
            project = await projectReq.json();
            projects = [...projects, {path: path, ...project.data}]
            return project.data;
        } catch(e) {
            console.log(e);
            return null;
        }
    }

    let stop = false;

    beforeNavigate(async ({ from, to, cancel, type }) => {
        const regex = new RegExp(/\/projects\/.+/g);

        if (from !== null && to !== null) {
            if(window.location.pathname !== $page.url.pathname) {
                stop = true;
            } else if(type==='popstate' && to.routeId === "projects/[slug]" && window.location.pathname === '/projects/pick-and-fix') {
                cancel();
                panelData.set(await getProject(`/projects/${to.params.slug}`));
                openPanel();
            } else if (from.routeId === "projects" && to.routeId === "projects/[slug]" && !regex.test(window.location.pathname)) {
                cancel();
                window.history.pushState(window.history.state, '', `projects/${to.params.slug}`)
                panelData.set(await getProject(`/projects/${to.params.slug}`));
                openPanel();
            }
        }
    });

    onMount(()=> {
        onpopstate = async () => {
            if(stop) return;

            const regex = new RegExp(/\/projects\/.+/g);

            if (regex.test(window.location.pathname)) {
                panelData.set(await getProject(window.location.pathname));

                openPanel();
            } else {
                closePanel();
            }
        };
    })

    afterUpdate(() => {
        if (browser && panelOpen) {
            lazyLoading.start();
        }
    })
</script>
<MainLayout>
    <div class="p-6 sm:px-12 3xl:px-16 4xl:px-24">
        <Seo title="{$settings['projects_meta_title']}" metaDescription="{$settings['projects_meta_description']}" ogImg="{$settings['projects_og']}" />
        <PageHeader title="Projects" />
        <article class="projects-list leading-normal grid grid-cols-1 lg:grid-cols-2 gap-10 3xl:gap-12 4xl:gap-20 pb-10 3xl:pb-12 4xl:pb-20">
            {#each data['data'] as project}
                <a href="projects/{project['slug']}">
                    <LazyLoadingWrapper class="hidden lg:block mb-3 3xl:mb-4 4xl:mb-6" lqip="{project['image_lqpi']}">
                        <img
                            src="{project['image']}"
                            alt="{project['title']}"
                            style="aspect-ratio:{project['aspect_ratio']};"
                            loading="lazy"
                        >
                    </LazyLoadingWrapper>
                    <LazyLoadingWrapper class="lg:hidden mb-3 3xl:mb-4 4xl:mb-6" lqip="{project['image_lqpi_mobile']}">
                        <img
                            src="{project['image_mobile']}"
                            alt="{project['title']}"
                            style="aspect-ratio:1/1;"
                            loading="lazy"
                        >
                    </LazyLoadingWrapper>
                    <h2 class="fw-400 text-base md:text-lg 3xl:text-2xl 4xl:text-3xl">{ project.title }</h2>
                    <div class="flex gap-2 3xl:gap-2.5 4xl:gap-4 text-base md:text-lg 3xl:text-2xl 4xl:text-3xl flex-wrap leading-none">
                        {#each project['technologies'] as technology, index}
                                <p class="text-gray-500 whitespace-nowrap">{ technology }{#if index !== project.technologies.length-1 },{/if}</p>
                        {/each}
                    </div>
                </a>
            {/each}
            <div class="odd:hidden even:flex justify-center items-center">
                <LazyLoadingWrapper lqip="" class="hidden lg:block mb-3 3xl:mb-4 4xl:mb-6">
                    <img alt="logo-2" src="/img/logo_4.3.1_favicon_1.0.svg" style="height: 86px; aspect-ratio: 1/1"/>
                </LazyLoadingWrapper>
            </div>
        </article>
    </div>
    <span slot="panel-title">{$panelData.title}</span>
    <article class="article-content" slot="panel">
        {@html $panelData.content}
    </article>
</MainLayout>
