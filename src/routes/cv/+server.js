import {redirect} from '@sveltejs/kit';
import {getSettings} from "../../helpers.js";

/** @type {import('./$types').RequestHandler} */
export async function GET({fetch}) {
    const settingsValue = await getSettings({fetch: fetch});

    if(!settingsValue['cv'])
        throw redirect(302, '/');
    else
        throw redirect(302, settingsValue['cv']);
}
