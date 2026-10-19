<script>
    import { page } from '$app/stores';
    import { localeFromPath } from '../lib/locale.js';
    import { canonicalUrl, localizedAlternates } from '../lib/seo.js';

    export let title;
    export let metaDescription;
    export let ogImg;
    export let availableLocales = [];
    export let pathname;

    $: locale = $page.data.locale || localeFromPath($page.url.pathname);
    $: currentPath = pathname || $page.url.pathname;
    $: canonical = canonicalUrl(currentPath);
    $: alternates = localizedAlternates(currentPath, availableLocales);
    $: ogLocale = locale === 'de' ? 'de_DE' : 'en_US';
    $: alternateOgLocales = alternates
        .filter((alternate) => alternate.locale !== locale)
        .map((alternate) => alternate.locale === 'de' ? 'de_DE' : 'en_US');
</script>

<svelte:head>
    <title>{title}</title>

    <meta name="description" content={metaDescription}>
    <meta name="author" content="Armin Salihović">

    <link rel="canonical" href={canonical}>
    {#each alternates as alternate (alternate.locale)}
        <link rel="alternate" hreflang={alternate.locale} href={alternate.url}>
    {/each}

    <meta property="og:title" content={title} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={ogImg} />
    <meta property="og:description" content={metaDescription} />
    <meta property="og:locale" content={ogLocale} />
    {#each alternateOgLocales as alternateLocale (alternateLocale)}
        <meta property="og:locale:alternate" content={alternateLocale} />
    {/each}
</svelte:head>
