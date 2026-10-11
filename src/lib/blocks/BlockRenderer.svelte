<script>
	import Paragraph from './Paragraph.svelte';
	import ArticleParagraph from './ArticleParagraph.svelte';
	import DoubleParagraph from './DoubleParagraph.svelte';
	import ArticleTitle from './ArticleTitle.svelte';
	import ArticleIntroduction from './ArticleIntroduction.svelte';
	import ArticleImage from './ArticleImage.svelte';
	import HeroImage from './HeroImage.svelte';
	import DownloadButton from './DownloadButton.svelte';

	export let blocks = [];
	export let project = null;

	const components = {
		paragraph: Paragraph,
		'article-paragraph-h3': ArticleParagraph,
		'double-paragraph': DoubleParagraph,
		'article-title': ArticleTitle,
		'article-introduction': ArticleIntroduction,
		'article-image': ArticleImage,
		'hero-image': HeroImage,
		'latest-cv-download-button': DownloadButton
	};
</script>

{#each blocks as block}
	<svelte:component
		this={components[block.type]}
		{block}
		technologies={project?.technologies ?? []}
	/>
{/each}
