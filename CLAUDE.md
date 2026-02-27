# CLAUDE.md — epiphan-cost-calculator

---

## MANDATORY: Observer Protocol

**You MUST follow this protocol before writing ANY code.** No exceptions. No rationalizing.

### Step 1: Classify Task Scope

| Scope | Criteria | Observer Required |
|-------|----------|-------------------|
| **MINIMAL** | Typos, comments, single config tweak | None |
| **SMALL** | 1-3 files changed, no new dependencies | observer-lite (Haiku) |
| **STANDARD** | 4-10 files, or any new dependency | observer-full (Sonnet) |
| **FULL** | >10 files, new architecture, new patterns | observer-full + feature contract |

### Step 2: Spawn Observer (if SMALL or above)

```
# For SMALL scope:
Task tool -> subagent_type: "observer-lite"
  prompt: "Run quality checks on the epiphan-cost-calculator codebase. Focus on [relevant area]."

# For STANDARD/FULL scope:
Task tool -> subagent_type: "observer-full"
  prompt: "Run full drift detection on epiphan-cost-calculator. The current task is: [describe task]."
```

### Step 3: For FULL scope — Create Feature Contract First

Before coding, create `.claude/contracts/[feature-name].md`:
- Define IN SCOPE and OUT OF SCOPE boundaries
- List success criteria
- Get observer approval before writing code

### Step 4: Verify Observer Ran

Before making your first code change, confirm:
- [ ] `.claude/OBSERVER_QUALITY.md` has a real date (not `_not yet run_`)
- [ ] Scope classification matches the task complexity

**If the PreToolUse hook prints `** OBSERVER NOT ACTIVE **`, STOP and spawn the observer.**

### Scope Escalation Rule

If during work you hit ANY of these triggers, upgrade from Lite to Full:
- **>5 files modified** (the PostToolUse hook will remind you)
- **New dependency added** to package.json
- **Task scope expanded** beyond original description

---

## Dual-Team Workflow

This project uses the **TK Dual-Team Daily Workflow**.

### Quality Gates

| Gate | Check | Enforced By |
|------|-------|-------------|
| Pre-code | Observer spawned | PreToolUse hook |
| During code | Scope escalation | PostToolUse hook |
| Pre-merge | No open BLOCKERs | OBSERVER_ALERTS.md |

### Observer Cost Guide

| Observer | Model | Cost | When |
|----------|-------|------|------|
| observer-lite | Haiku 4.5 | ~$0.03-0.05 | SMALL scope |
| observer-full | Sonnet 4.6 | ~$0.50-2.00 | STANDARD/FULL scope |

### Copy-Paste Prompts

**START DAY:** Start day — project is epiphan-cost-calculator. Path: ~/Desktop/tk_projects/epiphan-cost-calculator
**FEATURE BUILD:** Feature build — [FEATURE_NAME]
**END DAY:** End day — project is epiphan-cost-calculator

---

## Tech Stack

- **Framework**: Next.js 16 + React 19
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest (38 tests passing)
- **Deployment**: Vercel (auto from main)
- **URL**: https://epiphan-cost-calculator.vercel.app
