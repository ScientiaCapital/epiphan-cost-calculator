# Planning — epiphan-cost-calculator

## Architecture
- **Stack**: Next.js 16 | React 19 | Tailwind CSS v4 | Vitest
- **State**: Single `useState` + `useMemo` in `app/page.tsx` — no external state lib
- **Calculator**: Pure functions in `lib/calculator.ts` — zero React deps, fully testable
- **Constants**: `lib/constants.ts` — all research-backed data with source citations
- **Sharing**: URL query params encode inputs; `lib/parse-params.ts` decodes with validation

## Deployment
- **Vercel**: Auto-deploy from `main` via GitHub integration
- **URL**: https://epiphan-cost-calculator.vercel.app
- **Previous**: GitHub Pages (disabled 2026-02-27)

## Velocity (2026-02-27)
- Full migration from static HTML to React: ~1 session
- 38 tests, 0 build warnings, 0 secrets
- 5 Devil's Advocate findings resolved in same session
