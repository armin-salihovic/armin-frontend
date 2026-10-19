import { writable } from 'svelte/store';

export const panelOpen = writable(false);
export const panelData = writable({content: ''});
export const theme = writable('light');
