<script>
    import MainLayout from "../../../components/MainLayout.svelte";
    import Seo from "../../../components/Seo.svelte";

    /** @type {import('./$types').PageData} */
    export let data;
</script>

<MainLayout>
    <Seo title="{data.data.title + ' | Armin Salihović'}" metaDescription="{data.data.description}" ogImg="{data.data.image}" />
    <article class="article-content">
        {@html data.data.content}
    </article>
</MainLayout>

<!--  <div class="text-lg md:text-3xl md:text-5xl text-3xl md:text-5xl text-2xl md:text-4xl text-gray-500"></div>-->
<!--  <div class="mb-8 md:mb-16 pb-8 pb-5 md:pb-16 py-8 md:py-16 pr-32 xl:pr-32 pr-0 gap-1 gap-2 gap-3 gap-4 gap-5 gap-6 xs:block xs:hidden block"></div>-->
<!--  <div class="border border-black p-6 h-24 w-24 w-48 h-48 h-32 h-28 w-28 w-32 w-full lg:w-1/2 flex flex-col lg:flex-row gap-10">-->
<!-- 2K classes for backend support -->
<!--<div class="mb-8 mb-16 md:mb-16 3xl:mb-20 3xl:gap-5 3xl:text-6xl 3xl:text-5xl 3xl:gap-12 3xl:pr-40 3xl:mb-4 3xl:pb-7 "></div>-->
<!-- 4K classes for backend support -->
<!--<div class="4xl:mb-32 4xl:text-3xl 4xl:gap-8 4xl:gap-20 mb-10 3xl:mb-12 4xl:mb-20 4xl:mb-6 4xl:text-8xl 4xl:text-7xl 4xl:pb-10"></div>-->



