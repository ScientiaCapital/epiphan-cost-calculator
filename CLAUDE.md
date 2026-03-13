# CLAUDE.md — epiphan-cost-calculator

Pricing calculator for Epiphan Video hardware and software products. Deployed at https://epiphan-cost-calculator.vercel.app.

## Stack

- **Framework**: Next.js 16 + React 19 (App Router)
- **Styling**: Tailwind CSS v4 — CSS `@theme` directives, no `tailwind.config.js`
- **Testing**: Vitest (38 tests in `__tests__/`)
- **Deployment**: Vercel (auto-deploy from main)

## Quick Start

```bash
./init.sh
```

App runs at http://localhost:3000.

## Project Structure

```
app/             # Next.js App Router pages
components/      # Shared React components
lib/             # Pricing data, calculation logic, utilities
__tests__/       # Vitest test suite
legacy/          # Original static HTML reference
```

## Dev Commands

```bash
npm run dev      # Dev server
npm run build    # Production build
npm run lint     # ESLint
npx vitest       # Run tests
```

## Key Conventions

- Pricing data lives in clearly named constants or a data file — never inline
- All cost calculations must be deterministic and testable
- No OpenAI — this project has no LLM dependency
- TypeScript strict mode; App Router only
