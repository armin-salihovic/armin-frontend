<script>
	import { site } from '../lib/config/site.js';

    export let title;
    export let metaDescription;
    export let ogImg;
    export let canonicalPath = '/';

	$: canonicalUrl = new URL(canonicalPath, site.url).toString();
	$: ogImageUrl = ogImg ? new URL(ogImg, site.url).toString() : '';
</script>

<svelte:head>
    <title>{title}</title>

    <link rel="canonical" href={canonicalUrl}>
    <meta name="description" content="{metaDescription}">
    <meta name="author" content="Armin Salihović">

    <meta property="og:title" content="{title}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:image" content={ogImageUrl} />
    <meta property="og:description" content="{metaDescription}" />
</svelte:head>
