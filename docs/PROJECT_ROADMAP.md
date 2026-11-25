# Jassas Net Card — Project Roadmap

Last updated: 2026-11-25

## Project identity
- Product: Jassas Net Card / جساس نت كرت
- Service brand: JASSAS SOFT PRO
- Repository: JassasSoft/jassasnetcard
- Production branch: production
- Active feature branch: studio-creative-library (based on studio-mobile-ux)
- Stack: Next.js 16, React 19, Supabase, MikroTik RouterOS
- Primary interface: Arabic RTL, with English LTR option
- Light theme: calm, cool, readable colors
- Dark theme: royal blue

## Working rules
- Preserve existing working features and uncommitted changes.
- Never overwrite files without inspecting their current contents.
- Make small, focused changes and test after each feature.
- Do not add dependencies unless there is a clear need.
- Back up important files before editing.
- Keep final project backups outside the repository.
- Verify changes with git status, git diff --check, TypeScript and production build.
- Do not push or deploy without explicit approval.

## Approved product features

### 1. Shared design system
- Consistent visual identity, typography, spacing and component styles.
- Unified lightweight icon system.
- Responsive Arabic RTL and English LTR layouts.
- Calm light theme and royal-blue dark theme.
- Smooth, lightweight transitions and accessible controls.
- Clear loading, empty, success and error states.
- Fast performance on mid-range Android devices.

### 2. Navigation and customer experience
- Dashboard
- Card Design and Printing
- Jassas Card Vault
- MikroTik
- Jassas Rewards
- Jassas Academy
- Help Center
- About
- Keep logout and account actions accessible.
- Provide clear back navigation.

### 3. Jassas Academy and onboarding
- First-login welcome tour, shown after successful authentication.
- Six tour stations: Dashboard, Card Design, Card Vault, MikroTik, Rewards, Support.
- Start, skip, next, previous and resume controls.
- Save tour progress and completion persistently.
- Reopen the tour from Help Center.
- Tutorials, FAQs, search and contextual page explanations.
- Optional screenshots and videos.

### 4. About and Help Center
- Brand story, mission and product features.
- JASSAS SOFT PRO services.
- Support channels and contact details after verification.
- Privacy, terms, version and release notes.

### 5. Jassas Rewards
- Award points only after successful server-confirmed card creation.
- Printing and reprinting do not earn points.
- Reward cards must not generate additional points.
- Rewards: free cards, discounts and additional services.
- Use a secure, immutable points ledger and idempotent transactions.
- Keep reward cards in a separate wallet from paid subscription balance.
- Suggested reward tiers remain proposals until explicitly approved.

### 6. Jassas Card Vault
- Generate and save cards without immediate printing.
- Charge card balance once, at successful creation.
- Print or reprint saved cards without another balance charge.
- Support single-card and batch printing.
- Search and filter by card number, status and date.
- Display QR and card number for customer delivery.
- Track creation, printing, delivery and usage separately.
- Proposed states: available, reserved, delivered, used, expired.
- Keep print logs and reprint reasons.
- Do not treat card creation time as actual print time.

### 7. Card Design and Print Studio
- Nine approved sections:
  1. Network identity and profile
  2. Card number generation
  3. Duration and capacity
  4. Time and expiry
  5. Optional text
  6. Fonts and colors
  7. Shapes, borders and decorations
  8. Templates and design styles
  9. Card size, layout and printing
- Card shapes: **rectangle and square only**. Rounded/circular and triangle options are retired from the editor. Legacy version-1 snapshots containing retired shape values restore safely as rectangle.
- Four approved modes: كروت عادي، كروت عادي فاخر، كروت ملونه، كروت ملونه فخمه.
- Plain mode stays neutral and undecorated; luxury mode uses restrained accents; color mode uses a coordinated 3–4 color gradient; full-color luxury mode supports optional compressed image backgrounds.
- Keep persisted style IDs backward compatible: plain, luxury, three-color and colored.
- Functional frames, borders, colors and typography.
- Save designs, templates, reset section, undo and redo.
- Show and hide card elements.
- Local autosave.
- Shared palette, text-style and background-image helpers for preview and PDF; finish a single normalized renderer so both outputs cannot drift.
- Preserve QR, Supabase saving, balance charging and print retry.
- Preserve existing uncommitted work in the print page and global CSS.

### 8. Security and reliability
- Server-side authentication and role authorization.
- Never trust localStorage for administrator permissions.
- Verify authorization on every privileged API.
- Validate inputs on the server.
- Prevent duplicate card creation and duplicate charging.
- Use transactional database operations.
- Protect MikroTik credentials and administrative operations.
- Handle concurrent requests and failures safely.
- Optimize rendering and network requests.
- Test mobile usability and accessibility.

## Implementation sequence
1. Preserve the current working tree and document the project.
2. Audit authentication, administrator roles and privileged APIs.
3. Establish shared design tokens, icons, navigation and theme behavior.
4. Build Academy, Help Center and About.
5. Implement first-login onboarding and saved progress.
6. Implement Rewards database logic and secure server APIs.
7. Implement Card Vault and storage-only card creation.
8. Complete the four Card Studio design modes, image backgrounds, true shape geometry, and single-source preview/PDF rendering.
9. Run full security, mobile, performance and production-build checks; merge only after review.

## Current feature-branch work
- Active branch: studio-creative-library, based on studio-mobile-ux; production is untouched.
- Existing four-mode selector, compressed image background, and mobile landscape preview are retained.
- Added seven editable built-in design presets and three additional font stacks (Kufi, Naskh, system) with browser/device fallbacks.
- Corrected the shape selector to rectangle and square only; legacy rounded/triangle snapshot values normalize to rectangle. Preview and print markup receive the same shape ratio.
- Scoped the template library to the Design step.
- app/api/print-cards/route.ts and database schema were not changed.
- TypeScript, lint, production build, Android visual, PDF/print, restore and reprint tests remain pending.

## Status convention
- APPROVED: product direction confirmed.
- PROPOSED: details still need approval.
- PENDING: not implemented or not verified.
- DONE: implemented and tested.


## Card Studio feature audit — 2026-11-25

### Existing in the active feature branch
- Nine section navigation with scroll-to-section and active-section tracking.
- Sticky live preview with immediate form-driven updates.
- Four design modes: plain, luxury, three-color and full-color luxury.
- Seven built-in editable presets; presets change visual settings, not network/card-generation or subscription data.
- Palette selection, compressed local background image for full-color mode, borders, effects and multiple font stacks.
- Per-field visibility, font size, color, font family, alignment, border and text-background controls.
- QR generation, username prefix/length, batch quantity and print columns.
- Sample PDF/print window and saved batch print flow.
- Server-confirmed batch save, idempotency key, balance handling through existing API/RPC, batch history, version-1 snapshot restore and print retry.

### Gaps confirmed by source inspection — not yet implemented
- No undo/redo history controls.
- No local autosave/restore of an in-progress unsaved design.
- Built-in presets are selectable, but user-created custom templates are not saved to a personal template library.
- Live preview and print/PDF still use separate markup trees; a shared normalized renderer remains a reliability improvement.
- No explicit card-layout controls for element drag/reposition or layer ordering.
- Real-device PDF, physical print, QR scan, restore and retry tests still require execution.

### Reference-product study boundaries
- Cards Pro: reference for MikroTik initial setup, card management and print workflow.
- One Zero Net: reference for network/service management and reporting.
- Tiger Cloud: reference for cloud multi-router management, agents/wallets, design/printing and backup.
- These are product-study directions, not claims that every reference feature has been independently re-tested in this work session. Jassas implementation must remain original and preserve its own product identity.

### Next implementation order
1. Finish rectangle/square validation on Android preview and print output.
2. Build a single-source card renderer shared by preview and print/PDF.
3. Add safe local draft autosave and explicit restore/reset behavior.
4. Add undo/redo using bounded state snapshots; exclude card creation, balance and server operations from undo.
5. Add personal custom-template save/load only after storage scope and privacy behavior are defined.
6. Evaluate drag/reposition and layer ordering after renderer normalization; do not add controls that cannot be represented identically in print.
