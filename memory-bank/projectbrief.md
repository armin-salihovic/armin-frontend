# Project Brief

## Project Name

`armin-frontend`

## Purpose

This project is the frontend for Armin Salihović's personal portfolio website. It presents personal introduction content, projects, about information, contact capabilities, CV redirection, SEO metadata, and sitemap output.

## Core Requirements

- Render a responsive personal portfolio website using SvelteKit.
- Fetch page content, project data, settings, SEO metadata, sitemap XML, and CV URL from an external API configured via `PUBLIC_API_BASE_URL`.
- Provide primary public pages:
  - Home (`/`)
  - Projects (`/projects`)
  - Project detail (`/projects/[slug]`)
  - About (`/about`)
  - Contact (`/contact`)
  - CV redirect (`/cv`)
  - Sitemap proxy (`/sitemap.xml`)
- Support a project detail panel interaction from the projects listing while keeping standalone project detail pages available.
- Provide contact form validation and submit messages to the backend `/send-email` endpoint.
- Use global settings from the backend for social links, SEO fields, Open Graph images, and CV URL.

## Source of Truth

The current implementation is the source of truth. The default `README.md` is still the generated create-svelte README and does not fully describe the product.

## Success Criteria

- Portfolio pages load and render API-provided content.
- Navigation between Home, Projects, About, and Contact works.
- Project detail content can be opened from the projects list panel and accessed directly by URL.
- Contact form validates required fields and submits to the configured backend.
- SEO component receives metadata from settings or page data.
- Build works through `npm run build` when required environment variables and API availability are present.
