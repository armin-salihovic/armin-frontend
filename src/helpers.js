import {PUBLIC_API_BASE_URL} from "$env/static/public";
import {cache, settings} from "./store.js";

// This function will only update the settings if the cache has changed.
async function getSettings({fetch}) {
    const cacheRequest = await fetch(`${PUBLIC_API_BASE_URL}/cache`)
    const cacheResponse = await cacheRequest.json();

    let cacheValue;

    cache.subscribe((value) => {
        cacheValue = value;
    })

    if (cacheValue !== cacheResponse['cache']) {
        const settingsRequest = await fetch(`${PUBLIC_API_BASE_URL}/settings`);
        settings.set(await settingsRequest.json());
        cache.set(cacheResponse['cache']);
    }

    let settingsValue;

    settings.subscribe((value) => {
        settingsValue = value;
    })

    if (settingsValue === null) {
        const settingsRequest = await fetch(`${PUBLIC_API_BASE_URL}/settings`);
        settings.set(await settingsRequest.json());
    }

    return settingsValue;
}

export {
    getSettings,
}
