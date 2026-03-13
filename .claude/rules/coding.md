# epiphan-cost-calculator — Coding Rules

## Stack
- **Framework**: Next.js 16 (App Router), TypeScript
- **Styling**: Tailwind CSS v4 — uses CSS `@theme` directive, no `tailwind.config.js`
- **Deployment**: Vercel at epiphan-cost-calculator.vercel.app

## LLM Policy
- **No OpenAI** — do not add OpenAI as a dependency

## Tailwind v4 Conventions
- Define design tokens in CSS using `@theme { ... }` — never in a JS config file
- Use `@tailwindcss/postcss` plugin (not `tailwindcss` PostCSS plugin)
- No `tailwind.config.js` or `tailwind.config.ts` — configuration lives in CSS only

## Product Domain
- Pricing calculations are for Epiphan Video hardware and software products
- Keep pricing data in clearly named constants or a data file (not hard-coded inline)
- All cost calculations must be deterministic and testable

## General Patterns
- TypeScript strict mode
- App Router only — no Pages Router patterns
- No client-side secrets; all sensitive config via environment variables server-side
