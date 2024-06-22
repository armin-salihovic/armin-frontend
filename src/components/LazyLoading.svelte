<script>
    import {onMount} from "svelte";
    import {useLazyLoading} from "../lazy-loading.js";
    import {browser} from "$app/environment";
    import "../lazy-loading.css";

    const lazyLoading = useLazyLoading();

    onMount(() => {
        if (browser) {
            lazyLoading.start();
        }
    });
</script>
