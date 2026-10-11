# Product Context

## Purpose

This is Armin Salihović's personal portfolio. It introduces Armin, presents five software projects, shares about/contact information, and provides social links and a CV.

## User Experience

- Minimal, typography-focused layout with existing responsive breakpoints and dark mode.
- Project cards keep the current order, image variants, technologies, and visual layout.
- Selecting a project from the list opens the established slide-out panel; direct project links render the same blocks as a standalone article.
- Contact form validates name, email, subject, and message, then submits to same-origin `/api/contact`.
- `/cv` redirects to the local active PDF.

## Routes

- `/`, `/about`, `/contact`, `/projects`
- `/projects/multi-effects-guitar-pedal`
- `/projects/star-quest`
- `/projects/foodie`
- `/projects/mimo-website`
- `/projects/pick-fix`
- `/cv`, `/sitemap.xml`

Page and project content comes from local JavaScript modules. The only server-side external integration is the configured email API called by `/api/contact`.
