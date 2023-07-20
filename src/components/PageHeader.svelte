<div class="flex pb-16 pt-6 sm:justify-center sm:py-36 3xl:py-48 4xl:py-72 sm:grid sm:grid-cols-6">
    {#if $panelOpen}
        <div class="hidden sm:block sm:col-span-2 mt-2.5 4xl:mt-5">
            <a href="/" ><img class="page-header-logo inline-block" src="/img/logo_4.3.1_light.svg" alt="logo"></a>
        </div >
    {:else}
        <div class="hidden sm:block sm:col-span-2 mt-2.5 4xl:mt-5">
            <a href="/"><img class="page-header-logo inline-block" src="/img/logo_4.3.1.svg" alt="logo"></a>
        </div>
    {/if}
    <h1 class="text-5xl sm:text-7xl lg:text-8xl 3xl:text-9xl 4xl:text-[12rem] flex flex-col whitespace-pre fw-600 sm:col-span-4 leading-none"><span>{@html title}</span></h1>
</div>

<script>
    export let title;
    import {panelOpen} from "../store.js";
</script>

<style>
    .page-header-logo {
        height: 9rem;
    }

    @media (max-width: 2560px) {
        .page-header-logo {
            height: 4.75rem;
        }
    }
    @media (max-width: 1919px) {
        .page-header-logo {
            height: 4.75rem;
        }
    }

    @media (max-width: 1023px) {
        .page-header-logo {
            height: 3.75rem;
        }
    }
</style>
