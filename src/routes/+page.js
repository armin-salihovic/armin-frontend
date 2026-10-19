import { loadLocalizedContent } from '../lib/api.js';

export async function load(event) {
    return loadLocalizedContent(event, '/home');
}
