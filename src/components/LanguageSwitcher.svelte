<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { localizedPath, projectAvailableInLocale } from '../lib/locale.js';
    import { translate } from '../lib/i18n.js';

    export let locale = 'en';
    export let availableLocales = [locale];
    export let projectSlugsByLocale = {};
    let currentPath = $page.url.pathname;
    let lastPagePath = $page.url.pathname;

    $: if ($page.url.pathname !== lastPagePath) {
        lastPagePath = $page.url.pathname;
        currentPath = lastPagePath;
    }

    $: englishProjectAvailability = projectAvailableInLocale(currentPath, projectSlugsByLocale, 'en');
    $: germanProjectAvailability = projectAvailableInLocale(currentPath, projectSlugsByLocale, 'de');
    $: canSwitchToEnglish = englishProjectAvailability !== null
        ? englishProjectAvailability
        : availableLocales.includes('en');
    $: canSwitchToGerman = germanProjectAvailability !== null
        ? germanProjectAvailability
        : availableLocales.includes('de');

    onMount(() => {
        const updatePath = () => currentPath = window.location.pathname;
        updatePath();
        window.addEventListener('popstate', updatePath);
        window.addEventListener('app-path-change', updatePath);
        return () => {
            window.removeEventListener('popstate', updatePath);
            window.removeEventListener('app-path-change', updatePath);
        };
    });

    async function switchTo(event, targetLocale) {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (targetLocale === 'en' ? !canSwitchToEnglish : !canSwitchToGerman) return;
        event.preventDefault();
        const path = typeof window === 'undefined' ? currentPath : window.location.pathname;
        await goto(localizedPath(path, targetLocale));
    }
</script>

<nav class="language-switcher flex gap-2 text-sm sm:text-base" aria-label={translate(locale, 'nav.language')}>
    {#if canSwitchToEnglish}
        <a href={localizedPath(currentPath, 'en')} aria-current={locale === 'en' ? 'page' : undefined} on:click={(event) => switchTo(event, 'en')}>EN</a>
    {:else}
        <span aria-disabled="true">EN</span>
    {/if}
    <span aria-hidden="true">/</span>
    {#if canSwitchToGerman}
        <a href={localizedPath(currentPath, 'de')} aria-current={locale === 'de' ? 'page' : undefined} on:click={(event) => switchTo(event, 'de')}>DE</a>
    {:else}
        <span aria-disabled="true">DE</span>
    {/if}
</nav>

<style>
    .language-switcher a[aria-current='page'] {
        font-weight: 700;
        text-decoration: underline;
        text-underline-offset: 0.2em;
    }

    .language-switcher [aria-disabled='true'] {
        cursor: not-allowed;
        opacity: 0.45;
    }
</style>
