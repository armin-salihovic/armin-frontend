<script>
    import MessageBox from "../components/MessageBox.svelte";
    import PageHeader from "../components/PageHeader.svelte";
    import MainLayout from "../components/MainLayout.svelte";
    import Seo from "../components/Seo.svelte";
    import {settings} from "../store.js";

    let messageBox = {
        open: false,
        type: '',
        message: {
            title: '',
            content: null,
        }
    };

    function copyToClip() {
        navigator.clipboard.writeText($settings['social_discord']).then(function() {
            openMessageBox('success', 'Copied to clipboard', null);
            setTimeout(() => { messageBox.open = false; }, 3000);
        }, function(err) {
            console.error(err);
        });
    }

    function closeMessageBox() {
        messageBox.open = false;
        messageBox = messageBox;
    }

    function openMessageBox(type, title, content) {
        messageBox = {
            open: true,
            type: type,
            message: {
                title: title,
                content: content,
            }
        }
    }

    /** @type {import('./$types').PageData} */
    export let data;
</script>

<MainLayout>
    <div>
        <Seo title="{$settings['home_meta_title']}" metaDescription="{$settings['home_meta_description']}" ogImg="{$settings['home_og']}" />
        <div class="pt-6 px-6 sm:px-12 3xl:px-16 4xl:px-24">
            <PageHeader title="Hello, <br>I'm Armin" />
        </div>
        <div>
            {@html data.data.content}
        </div>
        <div class="px-6 sm:px-12 3xl:px-16 mb-40 3xl:mb-52 4xl:mb-80">
            <div class="flex grid grid-cols-6 text-base md:text-lg 3xl:text-2xl 4xl:text-3xl gap-4 3xl:gap-5 4xl:gap-8">
                <aside class="md:col-span-2 col-span-6"></aside>
                <div class="block-paragraph md:col-span-4 col-span-6 pr-0 xl:pr-32 3xl:pr-40 4xl:pr-64 flex gap-16 sm:gap-10 3xl:gap-12 4xl:gap-20">
                    <a href="{$settings['social_github']}" target="_blank" rel="noreferrer" class="icon sm:border sm:border-black sm:h-24 sm:w-24 3xl:w-32 3xl:h-32 4xl:h-48 4xl:w-48 sm:flex sm:justify-center sm:items-center">
                        <img class="h-7 3xl:h-9 4xl:h-14" src="/img/icon-github.svg" alt="icon github">
                    </a>
                    <a href="{$settings['social_linkedin']}" target="_blank" rel="noreferrer" class="icon sm:border sm:border-black sm:h-24 sm:w-24 3xl:w-32 3xl:h-32 4xl:h-48 4xl:w-48 sm:flex sm:justify-center sm:items-center">
                        <img class="h-7 3xl:h-9 4xl:h-14" src="/img/icon-linkedin.svg" alt="icon linkedin">
                    </a>
                    <a href="mailto:{$settings['social_email']}" target="_blank" rel="noreferrer" class="icon sm:border sm:border-black sm:h-24 sm:w-24 3xl:w-32 3xl:h-32 4xl:h-48 4xl:w-48 sm:flex sm:justify-center sm:items-center">
                        <img class="h-7 3xl:h-9 4xl:h-14" src="/img/icon-envelope.svg" alt="icon envelope">
                    </a>
                    <div on:click="{copyToClip}" on:keydown={copyToClip} class="cursor-pointer icon sm:border sm:border-black sm:h-24 sm:w-24 sm:flex 3xl:w-32 3xl:h-32 4xl:h-48 4xl:w-48 sm:justify-center sm:items-center">
                        <img class="h-7 3xl:h-9 4xl:h-14" src="/img/icon-discord.svg" alt="icon discord">
                    </div>
                </div>
            </div>
        </div>
        <MessageBox open="{messageBox.open}" message="{messageBox.message}" type="{messageBox.type}" on:close={closeMessageBox} />
    </div>
</MainLayout>

<style>
    .icon {
        transition: all 300ms ease, -webkit-transform 300ms ease;
    }
    .icon:hover {
        color: white;
        background-color: rgb(0 0 0);
    }
    .icon:hover img {
        filter: invert(97%) sepia(0%) saturate(7%) hue-rotate(167deg) brightness(118%) contrast(100%);
    }

    @media (max-width: 639px) {
        .icon:hover {
            color: unset;
            background-color: unset;
        }

        .icon:hover img {
            filter: unset;
        }
    }
</style>
