import { loadLocalizedProject } from '../../../../lib/api.js';

export async function load(event) {
    return loadLocalizedProject(event);
}
