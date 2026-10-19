<script>
import MainLayout from "../components/MainLayout.svelte";
import PageHeader from "../components/PageHeader.svelte";
import { page } from '$app/stores';
    import {translate} from '../lib/i18n.js';
    $: locale = $page.data.locale || 'en';
</script>

<svelte:head>
    <title>{translate(locale, 'error.notFoundTitle')}</title>
</svelte:head>

<MainLayout>
    <div class="h-screen">
        <div class="p-6 sm:px-12 3xl:px-16 4xl:px-24">
            <PageHeader title={translate(locale, 'error.notFoundTitle')} />
            <div class="flex grid grid-cols-6 text-base md:text-lg 3xl:text-2xl 4xl:text-3xl gap-4 3xl:gap-5 4xl:gap-8">
                <aside class="md:col-span-2 col-span-6">
                </aside>
                <div class="md:col-span-4 col-span-6">
                    <p>{$page.status === 404 ? ($page.error?.message || translate(locale, 'error.notFoundMessage')) : translate(locale, 'error.genericMessage')}</p>
                </div>
            </div>
        </div>
    </div>
</MainLayout>
