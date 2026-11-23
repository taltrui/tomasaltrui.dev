# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website for Tomás Altrui, built with Astro 7 and Tailwind CSS 4. Static output, hosted on Netlify. No UI framework: everything is `.astro` plus a small inline script.

## Common Commands

Node version is pinned in `.nvmrc` (run `nvm use`). Package manager: pnpm.

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
```

## Structure

- `src/layouts/main.astro` - Base layout: top nav (sobre mi | fotografia | escritura), language toggle (en/es), theme toggle (sun/moon), content area, footer links (github | linkedin | contact). Uses Astro's `ClientRouter` for fade transitions on the content area only.
- `src/layouts/blog-post.astro` - Article layout (bilingual title + date) wrapping `MainLayout`.
- `src/pages/index.astro` - About page (`/`).
- `src/pages/fotografia.astro` - Photography page (`/fotografia`).
- `src/pages/writing/index.astro` - Article list (`/writing`); posts are listed manually in the `posts` array.
- `src/pages/writing/<slug>.astro` - One file per article.
- `src/styles/global.css` - Tailwind import, color tokens, dark mode and language visibility rules.

## Layout Pattern

```astro
<MainLayout content={{ title: "page title" }} centered>
  <!-- page content -->
</MainLayout>
```

`centered` vertically centers the content between nav and footer.

## Language (en/es)

Both languages are rendered in the same page; CSS shows one. Wrap Spanish content in `class="es"` and English in `class="en"`. The choice is stored in `localStorage` (`lang`, default `es`) and applied to `<html data-lang>` by the inline script in `main.astro`, also after each client-side navigation (`astro:after-swap`).

## Theme

Light (paper) by default; dark via the `.dark` class on `<html>`, stored in `localStorage` (`theme`). Colors are CSS variables in `global.css` (`--background`, `--foreground`, `--muted`, `--muted-foreground`, `--border`, `--ring`) exposed as Tailwind colors (`bg-background`, `text-foreground`, ...). Use the `dark:` variant for theme-specific styles.

## Conventions

- Imports use the `@/*` alias (maps to `./src/*`).
- System font (`font-sans`), 16px, padding 32px around the page.
- Top nav: only the current page is underlined, others underline on hover. Every other link is always underlined.
