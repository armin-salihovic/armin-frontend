import {settings} from "../store.js";
import {PUBLIC_API_BASE_URL} from '$env/static/public';

export async function load({fetch}) {
    let settingsValue;

    settings.subscribe((value) => {
        settingsValue = value;
    })

    if(settingsValue === null) {
        const settingsRequest = await fetch(`${PUBLIC_API_BASE_URL}/settings`);
        settings.set(await settingsRequest.json());
    }
}