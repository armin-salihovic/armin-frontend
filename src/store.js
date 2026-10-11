import { writable } from 'svelte/store';

export const panelOpen = writable(false);
export const panelData = writable(null);
export const theme = writable('light');
