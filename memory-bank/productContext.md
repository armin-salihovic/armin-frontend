# Product Context

## Why This Project Exists

This frontend powers a personal portfolio site for Armin Salihović. It is intended to showcase professional work, provide personal/about information, make contact easy, and expose relevant social/CV links.

## User Experience Goals

- Minimal, typography-focused portfolio experience.
- Fast browsing between core pages.
- Responsive layouts for mobile through very large displays, including custom Tailwind breakpoints for `xs`, `3xl`, and `4xl`.
- Project browsing with visual previews and technology labels.
- Smooth project detail viewing through a slide-out panel on the projects page.
- Direct-link support for individual projects.
- Contact form with clear validation and success/failure feedback.

## Main User Flows

1. **Landing/Home**
   - User visits `/`.
   - Home content is fetched from `${PUBLIC_API_BASE_URL}/home`.
   - Social links are displayed using backend settings.

2. **Project Browsing**
   - User visits `/projects`.
   - Project list is fetched from `${PUBLIC_API_BASE_URL}/projects`.
   - User clicks a project and the app can open project details in an overlay panel using API data from `/projects/:slug`.

3. **Project Direct Link**
   - User visits `/projects/[slug]` directly.
   - Project data is loaded server-side and rendered as standalone article content.

4. **About**
   - User visits `/about`.
   - About content is fetched from `${PUBLIC_API_BASE_URL}/about`.

5. **Contact**
   - User visits `/contact`.
   - User completes name, email, subject, and message fields.
   - Frontend validates required fields/email format and posts to `${PUBLIC_API_BASE_URL}/send-email`.

6. **CV**
   - User visits `/cv`.
   - Settings are fetched if necessary; request redirects to the configured CV URL or home if unavailable.

## Content Model Expectations

The frontend expects backend responses shaped around a `data` property for most page and project responses. Settings are expected to include social links and metadata keys such as `home_meta_title`, `projects_meta_description`, `social_github`, `social_email`, and `cv`.
