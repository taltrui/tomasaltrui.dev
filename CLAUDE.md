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

- `src/layouts/main.astro` - Base layout: head metadata (title, author, canonical, hreflang alternates, og:*), top nav (about | photography | writing), language links (en/es), theme toggle (sun/moon), content area, footer links (github | linkedin | contact). Uses Astro's `ClientRouter` for fade transitions on the content area only.
- `src/layouts/blog-post.astro` - Article layout (title, date, rendered Markdown, article meta + JSON-LD) wrapping `MainLayout`.
- `src/components/WritingList.astro` - Article list, shared by both languages.
- `src/content/writing/<lang>/<slug>.md` - Articles (frontmatter: `title`, `date` as quoted `"YYYY-MM-DD"`, optional `description`). Collection defined in `src/content.config.ts`; helpers in `src/lib/writing.ts`.
- `src/pages/` - English routes: `/`, `/photography`, `/writing`, `/writing/[slug]`.
- `src/pages/es/` - Same routes in Spanish: `/es/`, `/es/photography`, `/es/writing`, `/es/writing/[slug]`.
- `src/lib/i18n.ts` - `Lang`, `localize(lang, path)`, `unlocalize(pathname)`, `formatDate`.
- `src/styles/global.css` - Tailwind import, color tokens, dark mode.

## Layout Pattern

```astro
<MainLayout lang="en" title="page title" centered>
  <!-- page content -->
</MainLayout>
```

`centered` vertically centers the content between nav and footer. Optional `description` and `type` ("website" | "article") feed the meta tags.

## Language (en/es)

Every page exists once per language and contains only that language, so crawlers and link previews see a single language. English is the default and lives at the root; Spanish lives under `/es`. Build internal links with `localize(lang, path)`. The en/es toggle links to the same path in the other language, so every page and article needs both versions (same slug in `en/` and `es/`).

## Theme

Light (paper) by default; dark via the `.dark` class on `<html>`, stored in `localStorage` (`theme`). Colors are CSS variables in `global.css` (`--background`, `--foreground`, `--muted`, `--muted-foreground`, `--border`, `--ring`) exposed as Tailwind colors (`bg-background`, `text-foreground`, ...). Use the `dark:` variant for theme-specific styles.

## Conventions

- Imports use the `@/*` alias (maps to `./src/*`).
- System font (`font-sans`), 16px, padding 32px around the page.
- Top nav: only the current page is underlined, others underline on hover. Every other link is always underlined.
