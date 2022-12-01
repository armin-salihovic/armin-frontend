<script>
import MainLayout from "../components/MainLayout.svelte";
import PageHeader from "../components/PageHeader.svelte";
import { page } from '$app/stores';
</script>

<MainLayout>
    <div class="h-screen">
        <div class="pt-6 sm:px-12">
            <PageHeader title="{$page.status}" />
            <div class="flex grid grid-cols-6 text-base md:text-lg gap-4">
                <aside class="md:col-span-2 col-span-6">
                </aside>
                <div class="md:col-span-4 col-span-6">
                    <p>{$page.error.message}</p>
                </div>
            </div>
        </div>
    </div>
</MainLayout>