import { error } from '@sveltejs/kit';
import {PUBLIC_API_BASE_URL} from '$env/static/public';

export async function load({params, fetch}) {
    const request = await fetch(`${PUBLIC_API_BASE_URL}/projects/${params.slug}`);

    if(request.status === 404) {
        throw error(404, "Sorry the page you're looking for is unavailable.");
    }

    return await request.json();
}