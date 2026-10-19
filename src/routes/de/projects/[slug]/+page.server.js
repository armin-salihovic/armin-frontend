import { localizedApiJson } from '../../../../lib/api.js';

export async function load({ params, fetch }) {
    return {
        ...(await localizedApiJson(fetch, `/projects/${encodeURIComponent(params.slug)}`, 'de')),
        locale: 'de'
    };
}
