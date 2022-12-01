import {PUBLIC_API_BASE_URL} from '$env/static/public';

export async function load({fetch}) {
    const request = await fetch(`${PUBLIC_API_BASE_URL}/about`);

    return await request.json();
}