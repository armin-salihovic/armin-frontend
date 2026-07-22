import {theme} from './store.js';

const THEME_STORAGE_KEY = 'theme';

function getPreferredTheme() {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if(storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(value) {
    document.documentElement.classList.toggle('dark', value === 'dark');
    document.documentElement.style.colorScheme = value;
    theme.set(value);
}

export function initTheme() {
    applyTheme(getPreferredTheme());
}

export function toggleTheme() {
    const nextTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
}