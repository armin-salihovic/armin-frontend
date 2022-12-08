import {PUBLIC_API_BASE_URL} from '$env/static/public';

export async function GET() {
    const data = await fetch(`${PUBLIC_API_BASE_URL}/sitemap.xml`);
    const body = await data.text();

    return new Response(
       body,
        {
            headers: {
                'Content-Type': 'application/xml'
            }
        }
    );
}