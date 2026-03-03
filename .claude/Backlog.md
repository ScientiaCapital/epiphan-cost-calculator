# Backlog — epiphan-cost-calculator

## Priority Items

### 1. Extract tier boundary constants
- **Source:** Observer ARCH DA#6 (2026-03-02)
- **Impact:** LOW — boundaries now exist only in `getRoomMix()` (single source of truth after `getRecommendation()` removal), but extracting `TIER_BOUNDARIES = { small: 25, large: 200 }` would make them more discoverable
- **Effort:** XS (10 min)
- **Owner:** Unassigned

### 2. Add RECORDING_UTILIZATION source citation
- **Source:** Observer ARCH (2026-03-02) — grade note
- **Impact:** LOW — constant is defensible (0.70) but lacks inline citation like other constants
- **Effort:** XS (5 min)
- **Owner:** Unassigned

### 3. Edge Premium pricing integration
- **Source:** Plan spec (2026-03-02)
- **Impact:** MEDIUM — Edge Premium ($20/device/mo) is mentioned in UI text but not included in ROI calculation (by design — free tier covers base use case). Could add optional toggle in future.
- **Effort:** M (1-2 hrs)
- **Owner:** Unassigned

---

## Completed / Archived

| Date | Item | Resolution |
|------|------|------------|
| 2026-03-02 | Dead `getRecommendation()` function | Removed in blended mix rewrite |
| 2026-03-02 | PDF hardcoded product header | Replaced with dynamic blended per-room |
| 2026-03-02 | Tier 1 investment path zero test coverage | Added tests for 1, 10, 25, 200, 201, 500 rooms |
| 2026-03-02 | `PER_ROOM_INVESTMENT` flat pricing | Replaced with `getRoomMix()` + `getInvestmentFromMix()` |
| 2026-03-02 | 5 prior session BLOCKERs (test/UI sync) | All resolved and committed |
