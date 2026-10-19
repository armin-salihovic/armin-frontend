<script>
    import "../app.css";
    import "../style.css";
    import {usePanel} from "../panel.js";
    import {page} from "$app/stores";
    import {onMount} from "svelte";
    import LazyLoading from "./LazyLoading.svelte";
    import {initTheme} from "../theme.js";
    import ThemeToggle from "./ThemeToggle.svelte";
    import LanguageSwitcher from './LanguageSwitcher.svelte';
    import {translate} from "../lib/i18n.js";
    import {localizedPath} from "../lib/locale.js";
    import {panelOpen} from "../store.js";

    let panelBackground1;
    let panelBackground2;
    let panelCloseButton;
    let panelContainer;
    let previouslyFocusedElement;
    let isPanelOpen = false;

    const {closePanel} = usePanel();

    function handlePanelClick(event) {
        if(event.target === panelBackground1 || event.target === panelBackground2) {
            window.history.back();
            closePanel(translate(locale, 'nav.projects'));
        }
    }

    function handleClose() {
        window.history.back();
        closePanel(translate(locale, 'nav.projects'));
    }

    function handleGlobalKeydown(event) {
        if (!isPanelOpen) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            handleClose();
            return;
        }
        if (event.key !== 'Tab') return;

        const focusableElements = panelContainer?.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements?.length) {
            event.preventDefault();
            panelContainer?.focus();
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (event.shiftKey && (document.activeElement === firstElement || !panelContainer.contains(document.activeElement))) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && (document.activeElement === lastElement || !panelContainer.contains(document.activeElement))) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    $: locale = $page.data.locale || 'en';
    $: settings = $page.data.settings || {};
    $: links = [
        {key: 'nav.projects', route: '/projects'},
        {key: 'nav.about', route: '/about'},
        {key: 'nav.contact', route: '/contact'},
    ];

    onMount(() => {
        initTheme();
        const unsubscribe = panelOpen.subscribe((open) => {
            isPanelOpen = open;
            if (open) {
                previouslyFocusedElement = document.activeElement;
                requestAnimationFrame(() => panelCloseButton?.focus());
            } else if (previouslyFocusedElement) {
                const elementToRestore = previouslyFocusedElement;
                previouslyFocusedElement = undefined;
                requestAnimationFrame(() => {
                    if (elementToRestore.isConnected) elementToRestore.focus();
                });
            }
        });
        window.addEventListener('keydown', handleGlobalKeydown);
        return () => {
            unsubscribe();
            window.removeEventListener('keydown', handleGlobalKeydown);
        };
    });
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap" rel="stylesheet">
</svelte:head>
<div>
    <LazyLoading />
    <div class="content w-full block bg-white dark:bg-[#181a1b] dark:text-[#dddad6] max-w-screen-2xl 3xl:max-w-screen-3xl 4xl:max-w-screen-4xl mr-auto sm:py-0 transition-colors duration-300">
        <header class="relative flex justify-between w-full sm:mt-auto sm:sticky top-0 sm:py-6 3xl:py-8 4xl:py-12 bg-white dark:bg-[#181a1b] z-10 p-6 sm:px-12 3xl:px-16 4xl:px-24 transition-colors duration-300">
            <div class="hidden sm:block sm:w-2/6 sm:leading-none sm:align-baseline sm:text-xl 3xl:text-3xl 4xl:text-4xl uppercase">
                <a href={localizedPath('/', locale)} aria-label={translate(locale, 'home.logo')}>Armin</a>
            </div>
            <div class="flex flex-col justify-between items-start gap-3 sm:hidden">
                <a href={localizedPath('/', locale)}><img class="logo dark:invert" src="/img/logo_4.3.1.svg" alt={translate(locale, 'a11y.logo')}></a>
                <div class="flex items-center gap-4">
                    <ThemeToggle {locale} />
                    <LanguageSwitcher {locale} />
                </div>
            </div>
            <div class="text-lg flex flex-col sm:w-4/6 sm:flex-row justify-start sm:text-xl 3xl:text-3xl 4xl:text-4xl sm:leading-none gap-5 3xl:gap-7 4xl:gap-10">
                {#each links as link}
                    <a href={localizedPath(link.route, locale)} class="nav-link" class:nav-link-active={$page.url.pathname.includes(link.route)}>{ translate(locale, link.key) }</a>
                {/each}
            </div>
            <div class="hidden sm:block absolute right-6 sm:right-12 3xl:right-16 4xl:right-24 top-6 sm:top-1/2 sm:-translate-y-1/2">
                <div class="flex items-center gap-4">
                    <LanguageSwitcher {locale} />
                    <ThemeToggle {locale} />
                </div>
            </div>
        </header>
        <slot></slot>
        <hr class="my-10 3xl:my-12 4xl:my-20 h-px bg-black dark:bg-[#dddad6] border-0">
        <div class="grid grid-cols-6 px-6 pb-10 3xl:pb-12 4xl:pb-20 sm:px-12 3xl:px-16 4xl:px-24 text-lg sm:text-xl 3xl:text-3xl 4xl:text-4xl">
            <aside class="md:col-span-2 col-span-6 pb-3 md:pb-0">
                <h3 class="">&copy; Armin Salihović</h3>
            </aside>
            <div class="md:col-span-4 col-span-6 flex flex-row gap-5 3xl:gap-7 4xl:gap-10">
                <a href="{settings['social_github']}" target="_blank" rel="noreferrer" class="link-underline">{translate(locale, 'social.github')}</a>
                <a href="{settings['social_linkedin']}" target="_blank" rel="noreferrer" class="link-underline">{translate(locale, 'social.linkedin')}</a>
                <a href="mailto:{settings['social_email']}" target="_blank" rel="noreferrer" class="link-underline">{settings['social_email']}</a>
            </div>
        </div>
    </div>
    <div class="panel__container overflow-hidden" bind:this={panelBackground1} on:click={handlePanelClick} role={$panelOpen ? 'dialog' : undefined} aria-modal={$panelOpen ? 'true' : undefined} aria-labelledby="project-panel-title" aria-hidden={!$panelOpen} inert={!$panelOpen ? '' : undefined} tabindex="-1">
        <div class="panel cursor-pointer absolute top-0 right-0 max-w-screen-panel z-50 xl:pl-32 2xl:pl-56 3xl:pl-72 4xl:pl-[28rem] lg:pl-0" bind:this={panelBackground2}>
            <header class="flex justify-between py-6 3xl:py-8 4xl:py-12 px-6 sm:px-10 3xl:px-12 4xl:px-20 fixed top-0 bg-white dark:bg-[#181a1b] dark:text-[#dddad6] leading-none text-xl 3xl:text-3xl 4xl:text-4xl cursor-default z-20 transition-colors duration-300">
                <h2 id="project-panel-title" class="truncate max-w-[calc(100vw-10rem)]"><slot name="panel-title">{translate(locale, 'panel.article')}</slot></h2>
                <div class="panel-header-controls flex items-center gap-4 sm:gap-6 fixed top-6 right-6 sm:right-14 3xl:top-8 4xl:top-12">
                    <LanguageSwitcher {locale} />
                    <button bind:this={panelCloseButton} type="button" class="cursor-pointer" on:click={handleClose} aria-label={translate(locale, 'panel.closeLabel')}>
                        <span class="relative hidden sm:block">{translate(locale, 'panel.close')}</span>
                        <img class="icon-cross dark:invert sm:h-2.5 3xl:h-4 4xl:h-5 h-3.5 block sm:absolute right-16 3xl:right-24 4xl:right-32 top-1/4" src="/img/icon-cross.svg" alt=""/>
                    </button>
                </div>
            </header>
            <div class="inner-panel bg-white dark:bg-[#181a1b] dark:text-[#dddad6] cursor-default transition-colors duration-300">
                <slot name="panel"></slot>
            </div>
        </div>
    </div>
</div>

<style>
    @media (max-width: 639px) {
        .icon-cross {
            margin-top: 3px;
        }
    }
</style>
