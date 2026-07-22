<script>
    import "../app.css";
    import "../style.css";
    import {usePanel} from "../panel.js";
    import {settings, theme} from "../store.js";
    import {page} from "$app/stores";
    import {onMount} from "svelte";
    import LazyLoading from "./LazyLoading.svelte";
    import {initTheme, toggleTheme} from "../theme.js";

    let panelBackground1;
    let panelBackground2;

    const {closePanel} = usePanel();

    function handlePanelClick(event) {
        if(event.target === panelBackground1 || event.target === panelBackground2) {
            window.history.back();
            closePanel();
        }
    }

    function handleClose() {
        window.history.back();
        closePanel();
    }

    const links = [
        {name: 'Projects', route: '/projects'},
        {name: 'About', route: '/about'},
        {name: 'Contact',route: '/contact', },
    ];

    onMount(() => {
        initTheme();
    });
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap" rel="stylesheet">
</svelte:head>
<div>
    <LazyLoading />
    <div class="content w-full block bg-white dark:bg-neutral-900 dark:text-neutral-100 max-w-screen-2xl 3xl:max-w-screen-3xl 4xl:max-w-screen-4xl mr-auto sm:py-0 transition-colors duration-300">
        <header class="flex justify-between w-full sm:mt-auto sm:sticky top-0 sm:py-6 3xl:py-8 4xl:py-12 bg-white dark:bg-neutral-900 z-10 p-6 sm:px-12 3xl:px-16 4xl:px-24 transition-colors duration-300">
            <div class="hidden sm:block sm:w-2/6 sm:leading-none sm:align-baseline sm:text-xl 3xl:text-3xl 4xl:text-4xl uppercase">
                <a href="/">Armin</a>
            </div>
            <a class="sm:align-baseline sm:order-3 sm:hidden" href="/"><img class="logo dark:invert" src="/img/logo_4.3.1.svg" alt="logo"></a>
            <div class="text-lg flex flex-col sm:w-4/6 sm:flex-row justify-start sm:text-xl 3xl:text-3xl 4xl:text-4xl sm:leading-none gap-5 3xl:gap-7 4xl:gap-10">
                {#each links as link}
                    <a href="{link.route}" class="nav-link" class:nav-link-active={$page.url.pathname.includes(link.route)}>{ link.name }</a>
                {/each}
                <button
                    class="theme-switch flex items-center gap-2 leading-none"
                    class:theme-switch-dark={$theme === 'dark'}
                    on:click={toggleTheme}
                    aria-label="Switch to {$theme === 'dark' ? 'light' : 'dark'} mode"
                    aria-pressed={$theme === 'dark'}
                >
                    <span class="theme-switch__label">{$theme === 'dark' ? 'Dark' : 'Light'}</span>
                    <span class="theme-switch__track" aria-hidden="true">
                        <span class="theme-switch__thumb"></span>
                    </span>
                </button>
            </div>
            <span class="hidden sm:block"></span>
        </header>
        <slot></slot>
        <hr class="my-10 3xl:my-12 4xl:my-20 h-px bg-black dark:bg-neutral-100 border-0">
        <div class="grid grid-cols-6 px-6 pb-10 3xl:pb-12 4xl:pb-20 sm:px-12 3xl:px-16 4xl:px-24 text-lg sm:text-xl 3xl:text-3xl 4xl:text-4xl">
            <aside class="md:col-span-2 col-span-6 pb-3 md:pb-0">
                <h3 class="">&copy; Armin Salihović</h3>
            </aside>
            <div class="md:col-span-4 col-span-6 flex flex-row gap-5 3xl:gap-7 4xl:gap-10">
                <a href="{$settings['social_github']}" target="_blank" rel="noreferrer" class="link-underline">GitHub</a>
                <a href="{$settings['social_linkedin']}" target="_blank" rel="noreferrer" class="link-underline">LinkedIn</a>
                <a href="mailto:{$settings['social_email']}" target="_blank" rel="noreferrer" class="link-underline">{$settings['social_email']}</a>
            </div>
        </div>
    </div>
    <div class="panel__container overflow-hidden" bind:this={panelBackground1} on:click={handlePanelClick} on:keydown="{handleClose}">
        <div class="panel cursor-pointer absolute top-0 right-0 max-w-screen-panel z-50 xl:pl-32 2xl:pl-56 3xl:pl-72 4xl:pl-[28rem] lg:pl-0" bind:this={panelBackground2}>
            <header class="flex justify-between py-6 3xl:py-8 4xl:py-12 px-6 sm:px-10 3xl:px-12 4xl:px-20 fixed top-0 bg-white dark:bg-neutral-900 dark:text-neutral-100 leading-none text-xl 3xl:text-3xl 4xl:text-4xl cursor-default z-20 transition-colors duration-300">
                <h2><slot name="panel-title">Article</slot></h2>
                <div class="cursor-pointer fixed top-6 3xl:top-8 4xl:top-12 right-6 sm:right-14" on:click={handleClose} on:keydown="{handleClose}">
                    <div class="relative hidden sm:block">Close</div>
                    <img class="icon-cross dark:invert sm:h-2.5 3xl:h-4 4xl:h-5 h-3.5 block sm:absolute right-16 3xl:right-24 4xl:right-32 top-1/4" src="/img/icon-cross.svg" alt="cross icon"/>
                </div>
            </header>
            <div class="inner-panel bg-white dark:bg-neutral-900 dark:text-neutral-100 cursor-default transition-colors duration-300">
                <slot name="panel"></slot>
            </div>
        </div>
    </div>
</div>

<style>
    .theme-switch {
        cursor: pointer;
    }

    .theme-switch__label {
        min-width: 2.75rem;
        text-align: left;
    }

    .theme-switch__track {
        position: relative;
        display: inline-block;
        width: 2.75rem;
        height: 1.35rem;
        border: 1px solid currentColor;
        border-radius: 9999px;
        transition: background-color 300ms ease, border-color 300ms ease;
    }

    .theme-switch__thumb {
        position: absolute;
        top: 50%;
        left: 0.2rem;
        width: 0.85rem;
        height: 0.85rem;
        border-radius: 9999px;
        background-color: currentColor;
        transform: translateY(-50%);
        transition: transform 300ms ease, background-color 300ms ease;
    }

    .theme-switch-dark .theme-switch__thumb {
        transform: translate(1.4rem, -50%);
    }

    .theme-switch:hover .theme-switch__track,
    .theme-switch:focus-visible .theme-switch__track {
        background-color: rgba(17, 17, 17, 0.08);
    }

    :global(.dark) .theme-switch:hover .theme-switch__track,
    :global(.dark) .theme-switch:focus-visible .theme-switch__track {
        background-color: rgba(245, 245, 245, 0.14);
    }

    .theme-switch:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 4px;
    }

    @media (max-width: 639px) {
        .icon-cross {
            margin-top: 3px;
        }
    }
</style>
