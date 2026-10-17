# Mata Hauri Basenjis

Modern redesign of the website for **Mata Hauri Basenjis**: the kennel's current and past dogs, champion stories, and contact details.

**Live:** https://mata-hauri.vercel.app

## Tech stack

- Vite 8 + React 19 + TypeScript, plain CSS (`src/styles.css`)
- All dog and page content lives in `src/data.ts` (typed `Dog` records); `src/App.tsx` renders it
- Static build — no server code and no environment variables

## Local development

Requires Node 20+.

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run build
```

## Deploying

Hosted on Vercel with the stock Vite preset (`npm run build`, output `dist`). Pushes to `main` deploy to production.
