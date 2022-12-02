<script>
    import "../app.css";
    import "../style.css";
    import {usePanel} from "../panel.js";
    import {settings} from "../store.js";
    import {page} from "$app/stores";
    import lazySizes from 'lazysizes';
    import 'lazysizes/plugins/parent-fit/ls.parent-fit';
    import {onMount} from "svelte";

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

    onMount(()=> {
        lazySizes.init();
    })
</script>

<svelte:head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,600;1,700;1,800;1,900&display=swap">
</svelte:head>
<div>
    <div class="content w-full block bg-white max-w-screen-2xl mr-auto sm:py-0">
        <header class="flex justify-between w-full sm:mt-auto sm:sticky top-0 sm:py-6 bg-white z-10 p-6 sm:px-12">
            <div class="hidden sm:block sm:w-2/6 sm:leading-none sm:align-baseline sm:text-xl uppercase">
                <a href="/">Armin</a>
            </div>
            <a class="sm:align-baseline sm:order-3 sm:hidden" href="/"><img class="logo" src="/img/logo_4.3.1.svg" alt="logo"></a>
            <div class="text-lg flex flex-col sm:w-4/6 sm:flex-row justify-start sm:text-xl sm:leading-none gap-5">
                {#each links as link}
                    <a href="{link.route}" class="nav-link" class:nav-link-active={$page.url.pathname.includes(link.route)}>{ link.name }</a>
                {/each}
            </div>
            <span class="hidden sm:block"></span>
        </header>
        <slot></slot>
        <hr class="my-10 h-px bg-black border-0">
        <div class="grid grid-cols-6 px-6 pb-10 sm:px-12 text-lg sm:text-xl">
            <aside class="md:col-span-2 col-span-6">
                <h3 class="">&copy; Armin Salihović</h3>
            </aside>
            <div class="md:col-span-4 col-span-6 flex flex-row gap-5">
                <a href="{$settings['social_github']}" target="_blank" rel="noreferrer" class="link-underline">GitHub</a>
                <a href="{$settings['social_linkedin']}" target="_blank" rel="noreferrer" class="link-underline">LinkedIn</a>
                <a href="mailto:{$settings['social_email']}" target="_blank" rel="noreferrer" class="link-underline">{$settings['social_email']}</a>
            </div>
        </div>
    </div>
    <div class="panel__container overflow-hidden" bind:this={panelBackground1} on:click={handlePanelClick} on:keydown="{handleClose}">
        <div class="panel cursor-pointer absolute top-0 right-0 max-w-screen-3xl z-50 2xl:pl-56 xl:pl-32 lg:pl-0" bind:this={panelBackground2}>
            <header class="flex justify-between py-6 px-6 sm:px-10 fixed top-0 bg-white leading-none text-xl cursor-default z-20">
                <h2><slot name="panel-title">Article</slot></h2>
                <div class="cursor-pointer fixed top-6 right-6 sm:right-14" on:click={handleClose} on:keydown="{handleClose}">
                    <div class="relative hidden sm:block">Close</div>
                    <img class="icon-cross sm:h-2.5 h-3.5 block sm:absolute right-16 top-1/4" src="/img/icon-cross.svg" alt="cross icon"/>
                </div>
            </header>
            <div class="inner-panel bg-white cursor-default">
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