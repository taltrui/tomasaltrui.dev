# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website built with Astro 5, React 19, and Tailwind CSS 4. The site showcases professional information, work experience, and blog posts for Tomas Altrui.

## Common Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Architecture

### Astro + React Hybrid Architecture

This project uses Astro as the main framework with React islands for interactive components. Astro handles routing and page rendering, while React components are used for interactive UI elements.

**Key integration points:**
- Astro config enables React integration: `@astrojs/react` in `astro.config.mjs`
- React components use `client:*` directives in Astro files for hydration
- TypeScript is configured with `jsx: "react-jsx"` for React support

### Component Structure

**Astro Components (.astro files):**
- `src/layouts/main.astro` - Base layout wrapper with header, footer, and global styles
- `src/pages/index.astro` - Homepage that composes Hero and Experience sections
- `src/pages/blog/index.astro` - Blog listing page

**React Components (.tsx files):**
- `src/components/Hero.tsx` - Main hero section with personal info and social links
- `src/components/Experience/` - Experience section with nested component structure
- `src/components/ui/` - shadcn/ui component library (New York style variant)
- `src/components/Header.tsx` - Site navigation header

### Styling System

**Tailwind CSS 4 with CSS Variables:**
- Uses Tailwind 4's new CSS-first configuration via `@import 'tailwindcss'` in `src/styles/global.css`
- Custom theme defined using `@theme inline` directive with CSS variables
- Color system uses OKLCH color space for better perceptual uniformity
- Supports light and dark modes through CSS variable overrides (`.dark` class)
- Font: Inconsolata (Google Fonts) set as `font-mono`

**shadcn/ui Integration:**
- Configured via `components.json` with New York style, zinc base color
- Path aliases: `@/components`, `@/lib/utils`, `@/ui` configured in both `tsconfig.json` and `components.json`
- Uses `cn()` utility from `src/lib/utils.ts` for class merging (clsx + tailwind-merge)
- Icons from Tabler Icons React and Lucide React

### Path Aliases

TypeScript path aliases are configured in `tsconfig.json`:
- `@/*` maps to `./src/*`

All imports should use these aliases instead of relative paths (e.g., `@/components/Hero` not `../components/Hero`).

### Content Strategy

**Blog Posts:**
- Markdown files in `src/pages/blog/` (e.g., `about-pre-optimization.md`)
- MDX support enabled via `@astrojs/mdx` integration
- Blog index at `/blog` manually links to posts (currently not auto-generated)

### Layout Pattern

Pages use the `MainLayout` component which expects a `content` prop:
```astro
<MainLayout content={{ title: "page title" }}>
  <!-- page content -->
</MainLayout>
```

The layout provides:
- HTML head with title and meta tags
- Header component
- Main content area with consistent padding and gap spacing
- Footer with attribution

## Development Notes

### Adding New Pages
1. Create `.astro` file in `src/pages/`
2. Wrap content in `<MainLayout content={{ title: "..." }}>`
3. Use React components with appropriate client directives if interactivity is needed

### Adding shadcn/ui Components
The project uses shadcn/ui components. When adding new components, they should be placed in `src/components/ui/` and follow the New York style variant configuration.

### Styling Guidelines
- Use Tailwind utility classes
- Leverage CSS variables for colors (e.g., `bg-foreground`, `text-primary-foreground`)
- Font is monospace (Inconsolata) site-wide via `font-mono` class
- Responsive design uses Tailwind's responsive prefixes
- Max content width: `max-w-screen-md mx-auto` (set in body)
