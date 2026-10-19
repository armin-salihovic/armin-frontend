<script>
    import { browser } from '$app/environment';
    import { page } from '$app/stores';

    $: locale = $page.data.locale === 'de' ? 'de' : 'en';
    $: if (browser && document.documentElement.lang !== locale) {
        document.documentElement.lang = locale;
    }
</script>

<slot />
