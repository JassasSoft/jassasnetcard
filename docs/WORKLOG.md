# Jassas Net Card — Engineering Work Log

Last updated: 2026-11-24

## Canonical project identity
- Product: Jassas Net Card / جساس نت كرت
- Brand: JASSAS SOFT PRO
- Repository: JassasSoft/jassasnetcard
- Production branch: `production`
- Current isolated work branch: `studio-four-design-modes`
- Public app: https://jassasnetcard.vercel.app

## Continuity rule
This file is the durable handoff point between ChatGPT Project chats, regular chats, and GitHub work sessions. Before continuing, read this file, `docs/PROJECT_ROADMAP.md`, `AGENTS.md`, and the latest target files on the active branch. Update this file at the end of each meaningful work session with completed work, verification, open risks, and the exact next task.

GitHub is the source of truth for code. ChatGPT Project sources and instructions hold working context. Do not assume a chat transcript is the only record of project state.

## User-approved working constraints
- User works from Android only; provide precise, copy-ready steps when Termux is needed.
- Inspect before editing. Preserve existing work and data.
- Never make direct changes to `production`.
- Use a focused feature branch and pull request for review.
- Do not overwrite whole files without a careful review and a clear reason.
- Preserve Supabase authentication, printed-card creation, balance charging, idempotency, QR, PDF, batch history, restore, and reprint behavior.
- No mock actions or fake success states.
- Do not deploy or merge without explicit approval.
- At the end of a work session, state what changed, what was tested, and the exact next step.

## Confirmed design direction: Card Studio
The Card Design and Printing page is being developed as a mobile-first Arabic RTL studio, with a compact back header, a live card preview kept visible near the top, and settings below it with navigation/auto-scroll to the selected section.

The four approved card design modes, in this exact order and naming, are:
1. **كروت عادي** — clean and practical; no ornamental decoration or design colors. Simple separators and restrained text containers/shapes are allowed.
2. **كروت عادي فاخر** — ornamental frames, borders, shapes, separators and premium icons, using restrained monochrome or limited luxury colors, not a multicolor palette.
3. **كروت ملونه** — coordinated palette of 3–4 colors, with the decorative capabilities of the luxury mode.
4. **كروت ملونه فخمه** — full creative mode, including optional image backgrounds and the full set of decorations, frames, icons, shapes and effects.

These are design modes over one shared design specification and rendering engine. Live preview, PDF export, and print output must consume the same normalized design data to avoid visual drift.

Existing style identifiers in the current production source include `colored`, `plain`, `three-color`, and `luxury`. Map them carefully to the approved user-facing modes; preserve old saved snapshots and sanitize unknown values safely. Do not break compatibility.

## Verified GitHub connector recovery
- ChatGPT Codex Connector is now installed on the personal GitHub account for the single selected repository `JassasSoft/jassasnetcard`.
- The installation is visible to the connected GitHub tools: repository search returned `JassasSoft/jassasnetcard`.
- A prior branch creation attempt failed with 403 before installation.
- After installation, creating `studio-four-design-modes` from `production` succeeded.
- The repository default branch is `main`; the working baseline for this task is explicitly `production`. Do not silently substitute `main`.

## Latest read-only source audit
Fetched from `production` on 2026-11-24:
- `app/dashboard/print-cards/page.tsx` — blob SHA `9a47f56034569fe534bd36374bef2349de7d2630`
- `app/globals.css` — blob SHA `c5c6d05c15ffab0446020e0cf56761e6da5b4f1a`
- `app/api/print-cards/route.ts` — blob SHA `60689342ee76cd7b66947150cac405906f94de07`
- `docs/PROJECT_ROADMAP.md` — blob SHA `cce939796fbeef80f83bca3d15fe7716f6d3d6dd`

No application source files have been changed by this work session. The only repository write so far is creation of the isolated branch and this work-log file.

### Current Studio findings
- Current defaults include `cardStyle: 'colored'`, `cardEffect: 'gradient'`, `colorScheme: 'blue-gold'`, `cardShape: 'rectangle'`, and the existing QR and typography settings.
- `getCardColors(style, scheme)` currently handles `plain`, `luxury`, `three-color`, and a color-scheme fallback.
- Existing color schemes include multiple palettes such as blue/gold, black/gold, white/blue and lime/green.
- Existing text style defaults, sanitization, shapes, effects, PDF/export and batch-history behavior require deeper inspection before changing the rendering model.
- The master context file mentioned in prior project conversations was not found at repository root by its expected filename. The user’s saved Project/Library copy remains the reference until its current location is confirmed.

## Current status
- GitHub connector: **DONE — repository access verified**.
- Isolated feature branch: **DONE — `studio-four-design-modes` created from `production`**.
- Four-mode product direction: **APPROVED**.
- Code implementation of four-mode selector and rendering: **PENDING**.
- Preview/PDF rendering unification audit: **PENDING**.
- TypeScript/build/mobile verification: **PENDING**.

## Exact next tasks
1. Inspect the complete current Studio component structure, all style-selector and card-rendering branches, snapshot serialization/sanitization, PDF generation, and print layout.
2. Trace how the current `cardStyle` values affect preview and PDF; document compatibility requirements before editing.
3. Design a typed, normalized four-mode configuration with backward-compatible migration from existing saved snapshots.
4. Implement the four-mode selector and mode-specific controls on this branch only, keeping the live preview and PDF output aligned.
5. Inspect the print API and preserve all server-side card creation, idempotency, balance and retry contracts.
6. Run `git diff --check`, `npx tsc --noEmit`, and `npm run build` in the local Termux environment when the user is ready to sync/test. Do not claim these passed until actually run.
7. Review the branch diff and open a pull request to `production` only after the user approves.
