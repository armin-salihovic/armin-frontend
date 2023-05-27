import { writable } from 'svelte/store';

export const panelOpen = writable(false);
export const panelData = writable({content: ''});
export const settings = writable(null);
export const cache = writable(null);
