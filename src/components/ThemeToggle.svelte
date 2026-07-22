<script>
    import {theme} from "../store.js";
    import {toggleTheme} from "../theme.js";
</script>

<button
    class="theme-switch flex items-center leading-none"
    class:theme-switch-dark={$theme === 'dark'}
    on:click={toggleTheme}
    aria-label="Switch to {$theme === 'dark' ? 'light' : 'dark'} mode"
    aria-pressed={$theme === 'dark'}
>
    <span class="theme-switch__track" aria-hidden="true">
        <span class="theme-switch__icon theme-switch__icon-sun">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
        </span>
        <span class="theme-switch__icon theme-switch__icon-moon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"></path>
            </svg>
        </span>
        <span class="theme-switch__thumb"></span>
    </span>
</button>

<style>
    .theme-switch {
        cursor: pointer;
    }

    .theme-switch__track {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        width: 3.25rem;
        height: 1.65rem;
        border: 1px solid currentColor;
        border-radius: 9999px;
        padding: 0 0.3rem;
        transition: background-color 300ms ease, border-color 300ms ease;
    }

    .theme-switch__icon {
        position: relative;
        z-index: 1;
        width: 0.8rem;
        height: 0.8rem;
        transition: opacity 300ms ease, color 300ms ease;
    }

    .theme-switch__icon svg {
        display: block;
        width: 100%;
        height: 100%;
    }

    .theme-switch__icon-moon {
        opacity: 0.45;
    }

    .theme-switch__thumb {
        position: absolute;
        top: 50%;
        left: 0.18rem;
        width: 1.15rem;
        height: 1.15rem;
        border-radius: 9999px;
        background-color: currentColor;
        transform: translateY(-50%);
        transition: transform 300ms ease, background-color 300ms ease;
    }

    .theme-switch-dark .theme-switch__thumb {
        transform: translate(1.55rem, -50%);
    }

    .theme-switch-dark .theme-switch__icon-sun {
        color: #dddad6;
        opacity: 1;
    }

    .theme-switch-dark .theme-switch__icon-moon {
        opacity: 1;
    }

    .theme-switch:hover .theme-switch__track,
    .theme-switch:focus-visible .theme-switch__track {
        background-color: rgba(17, 17, 17, 0.08);
    }

    :global(.dark) .theme-switch:hover .theme-switch__track,
    :global(.dark) .theme-switch:focus-visible .theme-switch__track {
        background-color: rgba(221, 218, 214, 0.14);
    }

    .theme-switch:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 4px;
    }
</style>