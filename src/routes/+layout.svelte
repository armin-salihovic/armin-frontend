<script>
    import { browser } from '$app/environment';
    import { page } from '$app/stores';
    import { localeFromPath } from '../lib/locale.js';

    $: locale = $page.data.locale || localeFromPath($page.url.pathname);
    $: if (browser && document.documentElement.lang !== locale) {
        document.documentElement.lang = locale;
    }
</script>

<slot />
