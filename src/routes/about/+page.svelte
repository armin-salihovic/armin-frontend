<script>
    import MainLayout from "../../components/MainLayout.svelte";
    import Seo from "../../components/Seo.svelte";
    import {page} from '$app/stores';
    $: settings = $page.data.settings || {};

    /** @type {import('./$types').PageData} */
    export let data;
</script>

<MainLayout>
    <div>
        <Seo title="{settings['about_meta_title']}" metaDescription="{settings['about_meta_description']}" ogImg="{settings['about_og']}" availableLocales={data.availableLocales} />
        <article class="article-content">
            {@html data.data.content}
        </article>
    </div>
</MainLayout>
