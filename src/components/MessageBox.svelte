<div class="{open ? 'message-box__opened':''} {type === 'success' ? 'bg-green-800' : ''} {type === 'fail' ? 'bg-red-800' : ''} message-box p-6 sm:px-12 3xl:px-16 4xl:px-24 fixed bottom-0 left-0 max-w-screen-2xl 3xl:max-w-screen-3xl 4xl:max-w-screen-4xl mr-auto w-full z-50">
    <div class="flex grid grid-cols-6 gap-4 3xl:gap-5 4xl:gap-8 py-0 lg:py-3 3xl:py-4 4xl:py-6">
        <aside class="md:col-span-2 col-span-6 relative">
            <h4 on:click={handleClick} on:keydown={handleClick} class="icon-cross text-white text-lg md:text-xl 3xl:text-3xl 4xl:text-4xl font-bold cursor-pointer">
                <img src="/img/icon-cross.svg" class="h-4 3xl:h-5 4xl:h-8" alt="icon cross">
            </h4>
        </aside>
        <div class="md:col-span-3 col-span-6 mt-4 md:mt-0">
            <h5 class="text-white text-lg md:text-xl 3xl:text-3xl 4xl:text-4xl font-bold">{ message.title }</h5>
            {#if message.content !== null}
                <div class="py-10 3xl:py-12 4xl:py-20">
                    {#each message.content as x}
                        <p class="text-white text-base md:text-lg 3xl:text-2xl 4xl:text-3xl">{@html x}</p>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>

<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let open = false;
    export let message = { title: '', content: null };
    export let type = '';

    function handleClick() {
        dispatch('close');
    }
</script>

<style>
    .icon-cross {
        filter: invert(97%) sepia(0%) saturate(7%) hue-rotate(167deg) brightness(118%) contrast(100%);
        position: absolute;
        top: 6px;
    }
    .message-box {
        opacity: 0;
        height: 0;
        transition: transform 300ms ease, -webkit-transform 300ms ease;
        transform: translateY(70px);
    }
    .message-box.message-box__opened {
        opacity: 1;
        height: unset;
        transform: none;
    }
</style>