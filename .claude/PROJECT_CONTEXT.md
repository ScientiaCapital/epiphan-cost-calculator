# Project Context — epiphan-cost-calculator

## Status: Live on Vercel
- **URL**: https://epiphan-cost-calculator.vercel.app
- **Stack**: Next.js 16 | React 19 | Tailwind v4 | Vitest
- **Tests**: 54 passing (calculator + parse-params + pdf-report)
- **Deploys**: Auto from `main` via GitHub + Vercel integration

## Last Session (2026-03-02)
- Shipped blended product mix (Nano/Nexus/Nexus+EC20/Pearl-2)
- Replaced flat $5,198/room with auto-calculated mix by deployment size
- 150-room investment: $780K -> $634K, ROI: 522% -> 665%
- Redesigned solution section with room mix breakdown table + dynamic product cards
- Added 16 new tests (38 -> 54), all passing
- Resolved all 5 prior observer BLOCKERs
- Force-deployed to Vercel production

## Tomorrow
Tomorrow: Backlog cleanup (tier boundary constants, RECORDING_UTILIZATION citation) or next feature | Sonnet builder | Est: 20min, $0.50 | Observer notes: no unresolved flags
