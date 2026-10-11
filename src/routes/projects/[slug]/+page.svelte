<script>
	import MainLayout from '../../../components/MainLayout.svelte';
	import Seo from '../../../components/Seo.svelte';
	import BlockRenderer from '../../../lib/blocks/BlockRenderer.svelte';

	export let data;
	$: project = data.project;
</script>

<MainLayout>
	<Seo
		title={project.title + ' | Armin Salihović'}
		metaDescription={project.description}
		ogImg={project.seo.ogImage}
		canonicalPath={'/projects/' + project.slug}
	/>
	<article class="article-content">
		<BlockRenderer blocks={project.blocks} {project} />
	</article>
</MainLayout>
