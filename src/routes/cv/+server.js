import {redirect} from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    throw redirect(302, '/cv/armin-salihovic-cv.pdf');
}
