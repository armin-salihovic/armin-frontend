<script>
	import PageHeader from '../../components/PageHeader.svelte';
	import MainLayout from '../../components/MainLayout.svelte';
	import { beforeNavigate } from '$app/navigation';
	import { afterUpdate, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { usePanel } from '../../panel.js';
	import { panelData, panelOpen } from '../../store.js';
	import Seo from '../../components/Seo.svelte';
	import LazyLoadingWrapper from '../../components/LazyLoadingWrapper.svelte';
	import { useLazyLoading } from '../../lazy-loading.js';
	import BlockRenderer from '../../lib/blocks/BlockRenderer.svelte';
	import { getProject } from '../../lib/content/projects/index.js';
	import { site } from '../../lib/config/site.js';
	import { images } from '../../lib/generated/images.js';

	export let data;
	$: projects = data.projects;

	if (browser) document.body.classList.add('relative');

	const { closePanel, openPanel } = usePanel();
	const lazyLoading = useLazyLoading();

	function projectFromPath(pathname) {
		const slug = pathname.split('/').filter(Boolean).at(-1);
		return getProject(slug);
	}

	function showPanel(project) {
		panelData.set(project);
		openPanel();
	}

	beforeNavigate(({ from, to, cancel, type }) => {
		if (!from || !to || to.routeId !== 'projects/[slug]') return;
		const project = getProject(to.params.slug);
		if (!project) return;

		if (type === 'popstate' || (from.routeId === 'projects' && window.location.pathname === $page.url.pathname)) {
			cancel();
			if (type !== 'popstate') window.history.pushState(window.history.state, '', to.url.pathname);
			showPanel(project);
		}
	});

	onMount(() => {
		const handlePopState = () => {
			if (window.location.pathname.startsWith('/projects/')) {
				const project = projectFromPath(window.location.pathname);
				if (project) showPanel(project);
				else closePanel();
			} else {
				closePanel();
			}
		};

		window.addEventListener('popstate', handlePopState);
		if (window.location.pathname.startsWith('/projects/')) handlePopState();
		return () => window.removeEventListener('popstate', handlePopState);
	});

	afterUpdate(() => {
		if (browser && $panelOpen) lazyLoading.start(document.querySelector('.inner-panel'));
	});
</script>

<MainLayout>
	<div class="p-6 sm:px-12 3xl:px-16 4xl:px-24">
		<Seo
			title={site.seo.projects.title}
			metaDescription={site.seo.projects.description}
			ogImg={site.seo.projects.ogImage}
			canonicalPath="/projects"
		/>
		<PageHeader title="Projects" />
		<article class="projects-list leading-normal grid grid-cols-1 lg:grid-cols-2 gap-10 3xl:gap-12 4xl:gap-20 pb-10 3xl:pb-12 4xl:pb-20">
			{#each projects as project}
				<a href={'/projects/' + project.slug}>
					<LazyLoadingWrapper class="hidden lg:block mb-3 3xl:mb-4 4xl:mb-6" lqip={images[project.card.desktop]?.lqip ?? ''}>
						<img
							src={project.card.desktop}
							alt={project.title}
							style={'aspect-ratio:' + project.card.aspectRatio + ';'}
							loading="lazy"
						>
					</LazyLoadingWrapper>
					<LazyLoadingWrapper class="lg:hidden mb-3 3xl:mb-4 4xl:mb-6" lqip={images[project.card.mobile]?.lqip ?? ''}>
						<img src={project.card.mobile} alt={project.title} style="aspect-ratio:1/1;" loading="lazy">
					</LazyLoadingWrapper>
					<h2 class="fw-400 text-base md:text-lg 3xl:text-2xl 4xl:text-3xl">{project.title}</h2>
					<div class="flex gap-2 3xl:gap-2.5 4xl:gap-4 text-base md:text-lg 3xl:text-2xl 4xl:text-3xl flex-wrap leading-none">
						{#each project.technologies as technology, index}
							<p class="text-gray-500 dark:text-[#9e9589] whitespace-nowrap">{technology}{#if index !== project.technologies.length - 1},{/if}</p>
						{/each}
					</div>
				</a>
			{/each}
			<div class="odd:hidden even:flex justify-center items-center">
				<LazyLoadingWrapper lqip="" class="hidden lg:block mb-3 3xl:mb-4 4xl:mb-6">
					<img alt="logo-2" src="/img/logo_4.3.1_favicon_1.0.svg" style="height: 86px; aspect-ratio: 1/1" />
				</LazyLoadingWrapper>
			</div>
		</article>
	</div>
	<span slot="panel-title">{$panelData?.title ?? 'Article'}</span>
	<article class="article-content" slot="panel">
		{#if $panelData}
			<BlockRenderer blocks={$panelData.blocks} project={$panelData} />
		{/if}
	</article>
</MainLayout>
