<script>
    import MainLayout from "../../../components/MainLayout.svelte";
    import Seo from "../../../components/Seo.svelte";

    /** @type {import('./$types').PageData} */
    export let data;
</script>

<MainLayout>
    <Seo title="{data.data.title}" metaDescription="{data.data.description}" ogImg="{data.data.image}" />
    <article class="article-content">
        {@html data.data.content}
    </article>
</MainLayout>

<!--  <div class="text-lg md:text-5xl text-3xl md:text-5xl text-2xl md:text-4xl text-gray-500"></div>-->
<!--  <div class="pr-32 xl:pr-32 pr-0 gap-1 gap-2 gap-3 gap-4 gap-5 gap-6 xs:block xs:hidden block"></div>-->
<!--  <div class="border border-black p-6 h-24 w-24 w-48 h-48 h-32 h-28 w-28 w-32 w-full lg:w-1/2 flex flex-col lg:flex-row gap-10">-->


