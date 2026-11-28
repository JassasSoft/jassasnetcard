# Jassas Net Card — Engineering Work Log

Last updated: 2026-11-28 (canonical production workflow and complete Studio page replacement)

## Canonical project identity
- Product: Jassas Net Card / جساس نت كرت
- Brand: JASSAS SOFT PRO
- Repository: JassasSoft/jassasnetcard
- Production branch: `production`
- Canonical working branch: `production` (single working branch)
- Public app: https://jassasnetcard.vercel.app

## Continuity rule
This is the durable handoff point across ChatGPT Project chats, regular chats, and GitHub work sessions. Before continuing, read this file, `docs/PROJECT_ROADMAP.md`, `AGENTS.md`, and the latest target files on `production`. Update this log after each meaningful work session with completed work, verification, risks, and the exact next task.

GitHub is the source of truth for code. ChatGPT Project instructions and sources hold working context. Never assume a chat transcript is the only record of project state.

## User-approved working constraints
- User works from Android only; provide precise, copy-ready Termux steps when local testing is needed.
- Inspect before editing. Preserve existing work and data.
- `production` is the only working branch; do not create side branches for routine page updates.
- After reviewing the complete current page, replace the target page file with one complete, coherent implementation rather than accumulating scattered patches.
- Preserve existing behavior and shared styles; update supporting files only when required.
- Do not manually deploy or change Vercel settings without explicit approval.
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

## Verified GitHub workflow
- ChatGPT GitHub connection is installed for `JassasSoft/jassasnetcard`.
- `production` is the approved canonical working branch for page updates.
- Repository default branch may still be `main`; do not switch the GitHub default branch or alter Vercel branch settings without explicit approval.
- Routine page updates are committed directly to `production` after complete-file inspection.

## Latest implementation on production
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
- Only rectangle and square card shapes are supported; circle, rounded and triangle are retired.
- The new image background path has not yet been exercised in a real mobile browser or print dialog.
- The complete Card Studio page and its supporting typography/layout styles are now being consolidated on `production`.
- The server API route remains unchanged.
- Old version-1 snapshots without a background image remain valid; image is optional.
- Do not claim TypeScript, build, visual, or print tests have passed until run locally.

## Current status
- GitHub connector: **DONE — repository access verified**.
- Canonical production workflow: **APPROVED — direct page replacements, no side branches**.
- Four-mode selector: **IMPLEMENTED — pending local verification**.
- Plain-mode neutral rendering and contrast fixes for both light modes: **IMPLEMENTED — pending visual verification**.
- Full-color image background upload and snapshot restore: **IMPLEMENTED — pending mobile/PDF verification**.
- Preview/PDF single-source rendering: **PENDING**.
- Rectangle and square shape support: **IMPLEMENTED — pending visual verification**.
- TypeScript/build/mobile/print verification: **PENDING**.
- Pull request and merge: **NOT STARTED**.

## Exact next tasks
1. Sync `production` to Termux without resetting or overwriting the user's local working tree.
2. Run `git status --short` and `git diff --check`.
3. Run `npx tsc --noEmit` and `npm run build`.
4. Test the two category entry screen, four design modes, rectangle and square, preview, image background and PDF on Android.
5. Verify batch save, balance charging, idempotent retry, history, restore and reprint using safe test conditions; never use real customer balance without approval.
6. Keep all future page work on `production`; no side branch, merge or manual deployment.
