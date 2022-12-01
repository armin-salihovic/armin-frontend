<script>
    export let title;
    export let metaDescription;
    export let ogImg;
</script>

<svelte:head>
    <title>{title}</title>

    <meta name="description" content="{metaDescription}">
    <meta name="author" content="Armin Salihović">

    <meta property="og:title" content="{title}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.armin.ba" />
    <meta property="og:image" content="{ogImg}" />
    <meta property="og:description" content="{metaDescription}" />
</svelte:head>