# Next.js Cleanup Checklist

Below is a list of typical Next.js files and directories that should be removed when migrating to Svelte:

## Core Next.js Files
- [ ] `next.config.js` or `next.config.mjs`
- [ ] `.next/` (build output directory)
- [ ] `next-env.d.ts` (TypeScript declarations for Next.js)
- [ ] `pages/` directory (if using Pages Router)
- [ ] `app/` directory (if using App Router)
- [ ] `public/` directory (consider keeping and repurposing for Svelte)

## Next.js Related Configuration
- [ ] `.eslintrc.json` (if Next.js specific rules are present)
- [ ] `tsconfig.json` (will need to be replaced with Svelte-specific version)
- [ ] `middleware.ts` or `middleware.js`
- [ ] `next-i18next.config.js` (if using i18n)

## React Dependencies in package.json
- [ ] `next`
- [ ] `react`
- [ ] `react-dom`
- [ ] `@next/font`
- [ ] Any Next.js related plugins and dependencies

## Next.js Specific Components
- [ ] Components using Next.js specific imports like:
  - [ ] `import Image from 'next/image'`
  - [ ] `import Link from 'next/link'`
  - [ ] `import { useRouter } from 'next/router'`
  - [ ] `import Head from 'next/head'`
  - [ ] `import Script from 'next/script'`

## After Cleaning Up
After removing these files, you should be ready to set up your Svelte project structure as outlined in the project tasks:

1. Initialize a new Svelte project using Vite
2. Set up appropriate project folders (`src/components/`, `src/routes/`, `src/lib/`, etc.)
3. Migrate UI components to Svelte format
4. Implement the BibleScroll component in Svelte 