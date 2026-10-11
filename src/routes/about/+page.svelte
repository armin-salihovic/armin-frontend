<script>
	import MainLayout from '../../components/MainLayout.svelte';
	import Seo from '../../components/Seo.svelte';
	import BlockRenderer from '../../lib/blocks/BlockRenderer.svelte';
	import { site } from '../../lib/config/site.js';

	export let data;
</script>

<MainLayout>
	<div>
		<Seo
			title={site.seo.about.title}
			metaDescription={site.seo.about.description}
			ogImg={site.seo.about.ogImage}
			canonicalPath="/about"
		/>
		<article class="article-content">
			<BlockRenderer blocks={data.page.blocks} />
		</article>
	</div>
</MainLayout>
