# Jassas Net Card — Engineering Work Log

Last updated: 2026-11-24 (after first four-mode implementation)

## Canonical project identity
- Product: Jassas Net Card / جساس نت كرت
- Brand: JASSAS SOFT PRO
- Repository: JassasSoft/jassasnetcard
- Production branch: `production`
- Active feature branch: `studio-creative-library` (branched from `studio-mobile-ux`)
- Public app: https://jassasnetcard.vercel.app

## Continuity rule
This is the durable handoff point across ChatGPT Project chats, regular chats, and GitHub work sessions. Before continuing, read this file, `docs/PROJECT_ROADMAP.md`, `AGENTS.md`, and the latest target files on the active branch. Update this log after each meaningful work session with completed work, verification, risks, and the exact next task.

GitHub is the source of truth for code. ChatGPT Project instructions and sources hold working context. Never assume a chat transcript is the only record of project state.

## User-approved working constraints
- User works from Android only; provide precise, copy-ready Termux steps when local testing is needed.
- Inspect before editing. Preserve existing work and data.
- Never make direct changes to `production`.
- Use a focused feature branch and pull request for review.
- Do not overwrite files without reviewing their current contents and preserving existing behavior.
- Preserve Supabase authentication, card creation, balance charging, idempotency, QR, PDF, batch history, restore, and reprint.
- No mock actions or fake success states.
- Do not merge or deploy without explicit approval.
- Report exactly what changed and what has or has not been tested.

## Confirmed Card Studio design direction
Mobile-first Arabic RTL Studio: compact back header, live card preview docked near the top, settings below, and section navigation that scrolls to the selected setting.

The four approved design modes, in this exact order and wording:
1. **كروت عادي** — clean and practical; no ornamental decoration or design colors. Simple separators and neutral text containers are allowed.
2. **كروت عادي فاخر** — premium frames, borders, shapes, separators and icons using restrained luxury colors, not a multicolor palette.
3. **كروت ملونه** — coordinated 3–4 color gradient with the decorative capabilities of the luxury mode.
4. **كروت ملونه فخمه** — full creative mode with selectable palettes, optional image background, frames, icons, shapes and effects.

Existing persisted style IDs remain backward compatible:
- `plain` → كروت عادي
- `luxury` → كروت عادي فاخر
- `three-color` → كروت ملونه
- `colored` → كروت ملونه فخمه

Do not rename persisted IDs without a migration. Existing print snapshots use version 1 and must continue to restore.

## Verified GitHub connector and branch
- ChatGPT Codex Connector is installed for the single selected repository `JassasSoft/jassasnetcard`.
- Connected GitHub tools can read and write the repository.
- Feature branch `studio-four-design-modes` was created from `production`.
- Repository default branch is `main`; this work intentionally branches from `production`.

## Latest implementation on the feature branch
Updated `app/dashboard/print-cards/page.tsx`:
- Replaced the old ambiguous style buttons with four clearly named mode cards and descriptions.
- Plain mode now uses neutral colors and readable dark text, a flat frame, no watermark, and no decorative effects or focus glow.
- The full-color luxury mode now offers a local image background upload, with the same background helper used by live preview and PDF.
- Uploaded images are validated, resized/compressed to JPEG, and capped at 135 KB before being included in a saved batch template.
- Image data is stored once in the version-1 snapshot template (not duplicated in settings), restored with strict data-URL validation and a 200,000-character ceiling, and used by both live preview and PDF rendering.
- Existing persisted style identifiers, QR generation, server card creation, idempotency, batch restore and reprint flows remain in place.
- No database schema or API route was changed.

Current source blob SHA:
- `app/dashboard/print-cards/page.tsx`: `143503e3341492a3fb3d1df8ce922487e7e90eab`

Unchanged during this work:
- `app/globals.css`
- `app/api/print-cards/route.ts`

## Important implementation limitations / open risks
- Live preview and PDF still have separate markup trees. Palette, text styling and background-image logic are shared, but full single-source rendering is not yet complete.
- The existing `triangle` option still needs a dedicated geometry review; its earlier implementation is a triangular corner treatment rather than a true triangular card silhouette.
- The new image background path has not yet been exercised in a real mobile browser or print dialog.
- GitHub compare reports the feature branch is 8 commits ahead of `production`, 0 behind; changed files are the Studio page, roadmap and work log. No changes to the API route or global stylesheet.
- Old version-1 snapshots without a background image remain valid; image is optional.
- Do not claim TypeScript, build, visual, or print tests have passed until run locally.

## Current status
- GitHub connector: **DONE — repository access verified**.
- Isolated feature branch: **DONE — based on production**.
- Four-mode selector: **IMPLEMENTED — pending local verification**.
- Plain-mode neutral rendering and contrast fixes for both light modes: **IMPLEMENTED — pending visual verification**.
- Full-color image background upload and snapshot restore: **IMPLEMENTED — pending mobile/PDF verification**.
- Preview/PDF single-source rendering: **PENDING**.
- Rounded/circular and triangle shapes are retired by the later 2026-11-25 user decision; do not implement them.
- TypeScript/build/mobile/print verification: **PENDING**.
- Pull request and merge: **NOT STARTED**.

## Exact next tasks
1. Sync `studio-four-design-modes` to Termux without resetting or overwriting the user's local working tree.
2. Run `git status`, inspect the branch and diff, then `git diff --check`.
3. Run `npx tsc --noEmit` and `npm run build`; fix any errors on this feature branch only.
4. Test all four modes in the live preview, including changing shape, text, QR and effects.
5. Upload a small image on Android; verify preview, sample PDF, saved batch, restore and reprint all preserve it.
6. Review the existing API's 2 MB request and 512 KB snapshot limits against representative batch sizes; keep the image payload within those limits.
7. Continue the single-source preview/PDF rendering and true triangle-shape work.
8. Review the complete diff and open a PR to `production` only after verification and user approval.


## 2026-11-25 — Creative template library and typography/shape expansion

- Active implementation branch: `studio-creative-library`, based on the reviewed `studio-mobile-ux` branch; production remains untouched.
- Added seven built-in, editable starting templates: royal blue, emerald/gold, purple/silver, midnight/gold, calm sky, classic clean, and royal luxury.
- Templates change visual settings only (design mode, palette, effect, shape, frame, and typography). They deliberately do not alter network identity, card generation values, quantities, or subscription/balance behavior.
- Historical note: the first implementation temporarily added rectangle, square, rounded and triangle; the later 2026-11-25 user decision superseded this and limits the editor to rectangle and square.
- Extended text-font choices with Kufi, Naskh, and system font stacks, retaining the existing five font identifiers. These use device/browser fonts with fallbacks; no remote font dependency was added.
- Applied the shape helper to both live preview and print HTML. Added CSS so the template library is visible only during the Design step.
- API route and database schema were not changed.
- Implementation commits: `2c92e567` (library and shapes), `1d94d2d` (scope template section), `1d26d5d` (step visibility).
- Verification status: **PENDING**. No TypeScript, lint, production build, Android visual, PDF/print, or restore tests have been run in this session. Vercel status for the first feature commit was pending at the time checked.
- Known visual risk: the triangular silhouette uses CSS clip-path and needs real-device inspection to confirm that the internal card content remains legible and that print browsers preserve the cut shape.

## Exact next tasks after this session

1. Sync `studio-creative-library` to Termux without resetting or overwriting local work; inspect `git status` and the diff first.
2. Run `git diff --check`, `npx tsc --noEmit`, and `npm run build`; fix failures only on this feature branch.
3. Test all seven presets and both approved shapes (rectangle and square) in the sticky live preview on Android.
4. Generate sample PDF and a real batch print preview for rectangle and square; verify QR, text clipping and square proportions.
5. Verify old version-1 batch restore and reprint still work.
6. Review and refine rectangle/square proportions and font fallbacks based on actual output.
7. Continue with user-saved custom templates and undo/redo only after the first phase passes verification.
8. Open a PR to `production` only after review and explicit user approval; do not merge or deploy manually.

## 2026-11-25 — Approved shape correction and feature audit

- User clarified the final shape decision: **rectangle and square only**. The rounded/circular and triangle options must not appear in the design UI.
- Updated `app/dashboard/print-cards/page.tsx`: removed rounded/triangle choices and geometry, restricted accepted restored shape values to rectangle/square, and normalized legacy rounded/triangle values to rectangle. Existing version-1 snapshot structure and server API contract were not changed.
- Updated all seven built-in presets so none selects a retired shape. Square presets use a square aspect ratio; rectangle presets use the landscape ratio in preview and print markup.
- Updated `docs/PROJECT_ROADMAP.md` to make the current approved shape decision authoritative and record a source-based feature audit.
- Confirmed present capabilities: nine-section navigation, sticky live preview, four design modes, seven built-in presets, palette/background/effects/fonts, per-field typography/visibility controls, QR, batch generation, sample print/PDF, server batch save/idempotency, batch history, snapshot restore and print retry.
- Confirmed gaps from source inspection: no undo/redo controls, no local draft autosave, no personal custom-template save/load, no drag/reposition or layer ordering, and preview/print still have separate markup trees.
- Reference-study scope carried forward: Cards Pro (MikroTik setup and card workflow), One Zero Net (network/service management and reporting), Tiger Cloud (cloud multi-router, agents/wallets, design/print and backup). This is inspiration only; no competitor code or identity is copied.
- API route, Supabase schema, balance logic and production branch were not modified.
- Verification: TypeScript and production build passed locally before this correction. The corrected branch still requires a fresh TypeScript/build run and Android preview/PDF/print/restore tests. Do not mark the shape work fully verified until those tests pass.
- Next: pull this feature branch on Termux, inspect the diff, rerun TypeScript/build, then test rectangle and square in preview, PDF and saved-batch restore.

## 2026-11-27 — Studio entry flow and design/print workspace

- Added a first-entry screen with two explicit choices: ordinary cards and colored cards. Each choice includes a short feature summary and opens the corresponding persisted design mode.
- Removed the duplicated ordinary/colored mode selector from the top of the editing workspace; mode selection now happens before entering the workspace.
- Added a workspace task switcher for Design and Print. The live card preview is rendered only in Design mode; Print mode moves the user to the existing print settings step.
- Added a compact visual language for the entry cards and task switcher, including mobile layouts, focus-visible states and restrained Jassas blue/gold styling.
- Kept existing design mode IDs, seven presets, QR, batch generation, Supabase save/idempotency, history, restore and retry logic intact.
- Reference review: Cards Pro describes ready-made voucher templates and cut-ready PDF; Card Designer Pro describes element-level design and page margins; SAMM/RADTik document real card dimensions, paper sizes, A4 layouts and thermal 58/80mm outputs. These are inspiration only, not claims of implementation.
- **Not yet implemented in this change:** physical card width/height controls, paper size/orientation/margins, per-page layout preview, unified preview/PDF renderer, and actual split of all controls into isolated Design vs Print panels. The Print tab currently routes to the existing print step, which still shares the broader settings form.
- No API route, database schema, Supabase balance logic or production branch changed.
- Verification: no fresh TypeScript/build/mobile interaction test has been run after this UI change. Must run on Termux before considering it verified.
- Next: add explicit mm-based card dimensions and paper presets (A4/A5/Letter and 58/80mm thermal), page orientation, margins and per-sheet preview; ensure print CSS consumes the same values; then split print-only controls cleanly from design controls.
