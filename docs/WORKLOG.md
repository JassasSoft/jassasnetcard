# Jassas Net Card — Engineering Work Log

Last updated: 2026-11-24

## Canonical project identity
- Product: Jassas Net Card / جساس نت كرت
- Brand: JASSAS SOFT PRO
- Repository: JassasSoft/jassasnetcard
- Production branch: `production`
- Active feature branch: `studio-four-design-modes`
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
- Plain mode now uses neutral colors, a flat frame, no watermark, and no decorative effects.
- The full-color luxury mode now offers a local image background upload.
- Uploaded images are validated, resized/compressed to JPEG, and capped at 135 KB before being included in a saved batch template.
- Image data is stored once in the version-1 snapshot template (not duplicated in settings), restored with strict data-URL validation and a 200,000-character ceiling, and used by both live preview and PDF rendering.
- Existing persisted style identifiers, QR generation, server card creation, idempotency, batch restore and reprint flows remain in place.
- No database schema or API route was changed.

Current source blob SHA:
- `app/dashboard/print-cards/page.tsx`: `b1d0ec2d9b8fba744b7da85f180d9f148dd53d70`

Unchanged during this work:
- `app/globals.css`
- `app/api/print-cards/route.ts`

## Important implementation limitations / open risks
- Live preview and PDF still have separate markup trees. Palette, text styling and background-image logic are shared, but full single-source rendering is not yet complete.
- The existing `triangle` option still needs a dedicated geometry review; its earlier implementation is a triangular corner treatment rather than a true triangular card silhouette.
- The new image background path has not yet been exercised in a real mobile browser or print dialog.
- Old version-1 snapshots without a background image remain valid; image is optional.
- Do not claim TypeScript, build, visual, or print tests have passed until run locally.

## Current status
- GitHub connector: **DONE — repository access verified**.
- Isolated feature branch: **DONE — based on production**.
- Four-mode selector: **IMPLEMENTED — pending local verification**.
- Plain-mode neutral rendering: **IMPLEMENTED — pending visual verification**.
- Full-color image background upload and snapshot restore: **IMPLEMENTED — pending mobile/PDF verification**.
- Preview/PDF single-source rendering: **PENDING**.
- True triangle geometry: **PENDING**.
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
