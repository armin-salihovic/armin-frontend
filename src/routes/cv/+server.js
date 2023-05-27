import {redirect} from '@sveltejs/kit';
import {settings} from "../../store.js";
import {PUBLIC_API_BASE_URL} from "$env/static/public";

/** @type {import('./$types').RequestHandler} */
export async function GET({fetch}) {
    let settingsValue;

    settings.subscribe((value) => {
        settingsValue = value;
    })

    if (settingsValue === null) {
        const settingsRequest = await fetch(`${PUBLIC_API_BASE_URL}/settings`);
        settings.set(await settingsRequest.json());
    }

    if(!settingsValue['cv'])
        throw redirect(302, '/');
    else
        throw redirect(302, settingsValue['cv']);
}
