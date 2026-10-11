import { error } from '@sveltejs/kit';
import { getProject } from '../../../lib/content/projects/index.js';

export function load({ params }) {
	const project = getProject(params.slug);
	if (!project) throw error(404, "Sorry, the page you're looking for is unavailable.");
	return { project };
}
