# Jassas Net Card — Project Roadmap

Last updated: 2026-11-24

## Project identity
- Product: Jassas Net Card / جساس نت كرت
- Service brand: JASSAS SOFT PRO
- Repository: JassasSoft/jassasnetcard
- Production branch: production
- Active feature branch: studio-four-design-modes
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
- Card shapes: rectangle, square, rounded and triangle; verify the triangle as a true silhouette, not only a corner ornament.
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
- Active branch: studio-four-design-modes (created from production).
- app/dashboard/print-cards/page.tsx has the first implementation of the four modes and optional compressed background image.
- app/globals.css and app/api/print-cards/route.ts were not changed in this phase.
- Local TypeScript, production build, Android preview, PDF, restore and reprint tests are still pending.

## Status convention
- APPROVED: product direction confirmed.
- PROPOSED: details still need approval.
- PENDING: not implemented or not verified.
- DONE: implemented and tested.
