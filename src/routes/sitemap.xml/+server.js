import { site } from '../../lib/config/site.js';
import { projects } from '../../lib/content/projects/index.js';

export async function GET() {
    const paths = [
        '/',
        '/about',
        '/contact',
        '/projects',
        ...projects.map((project) => `/projects/${project.slug}`)
    ];
    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
        .map((path) => `  <url><loc>${new URL(path, site.url).toString()}</loc></url>`)
        .join('\n')}\n</urlset>`;

    return new Response(
       body,
        {
            headers: { 'Content-Type': 'application/xml; charset=utf-8' }
        }
    );
}
