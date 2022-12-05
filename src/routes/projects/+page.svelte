<script>
    import PageHeader from "../../components/PageHeader.svelte";
    import MainLayout from "../../components/MainLayout.svelte";
    import {beforeNavigate} from "$app/navigation";
    import {onMount} from "svelte";
    import {page} from "$app/stores";
    import {browser} from "$app/environment";
    import {usePanel} from "../../panel.js";
    import {panelData, settings} from "../../store.js";
    import Seo from "../../components/Seo.svelte";
    import {PUBLIC_API_BASE_URL} from '$env/static/public';

    /** @type {import('./$types').PageData} */
    export let data;

    let projects = [];

    if(browser) { document.body.classList.add('relative') }

    const {closePanel, openPanel} = usePanel();

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
</script>
<MainLayout>
    <div class="p-6 sm:px-12 3xl:px-16">
        <Seo title="{$settings['projects_meta_title']}" metaDescription="{$settings['projects_meta_description']}" ogImg="{$settings['projects_og']}" />
        <PageHeader title="Projects" />
        <article class="projects-list leading-normal grid grid-cols-1 lg:grid-cols-2 gap-10 3xl:gap-12 pb-10 3xl:pb-12">
            {#each data.data as project}
                <a href="projects/{project.slug}">
                    <figure class="projects-img-container mb-3 3xl:mb-4" style="{`background-image:url('${project.image_lqpi}');`}">
                        <img alt="{ project.title }" class="lazyload blur-up w-full absolute" src="{project.image}" data-src="{project.image}" />
                    </figure>
                    <h2 class="fw-500 text-base md:text-lg 3xl:text-2xl">{ project.title }</h2>
                    <div class="flex gap-2 3xl:gap-2.5 text-base md:text-lg 3xl:text-2xl flex-wrap leading-none">
                        {#each project.technologies as technology, index}
                                <p class="text-gray-500 whitespace-nowrap">{ technology }{#if index !== project.technologies.length-1 },{/if}</p>
                        {/each}
                    </div>
                </a>
            {/each}
        </article>
    </div>
    <span slot="panel-title">{$panelData.title}</span>
    <article class="article-content" slot="panel">
        {@html $panelData.content}
    </article>
</MainLayout>

<style>
    .projects-img-container {
        padding-bottom: 56.228%;
        background-position: center top;
        background-repeat: no-repeat;
        background-size: cover;
        position: relative;
        overflow: hidden;
    }
</style>