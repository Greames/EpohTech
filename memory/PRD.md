# Second Salary Capital — PRD

## Original Problem Statement
Build the complete website for Second Salary Capital, a venture studio / company-building
platform (not a VC fund, broker or marketplace). Brand line: "It Started With Our Second Salary."
Public proof: 80+ Investors Onboarded, 2+ Startups Funded, ₹10L–₹10Cr Investment Opportunity Range.
Ecosystem: Founders + Investors + Capital + EPOHTECH (technology partner) + business support.
Origin story: first salary to parents & God (gratitude), second salary started a company (building).
Website jobs: establish credibility, attract founders (BUILD WITH US), attract investors
(INVEST WITH US), explain the ecosystem. Do NOT reveal current ventures publicly.
Design: premium, bold, obsidian + champagne accent, kinetic hero, animated counters, marquee,
mobile-first. Integrations: Emergent-managed Google sign-in, Resend transactional email.

## User Personas
- Founder: has idea/expertise/existing business; wants capital + tech + support.
- Investor: wants structured venture opportunities (₹10L–₹10Cr range) with documentation.
- Studio team (future admin): manages applications, investors, ventures, pipeline.

## Architecture
- Frontend: React (CRA/craco), Tailwind, framer-motion, Lenis smooth scroll, Sonner toasts.
- Backend: FastAPI + MongoDB (motor). All routes under /api.
- Auth: Emergent-managed Google OAuth → backend /api/auth/session exchanges session_id,
  httpOnly session_token cookie (7 days), users + user_sessions collections, custom user_id (UUID).
- Email: Emergent managed Resend proxy (EMERGENT_EMAIL_KEY in backend/.env,
  EMAIL_FROM_NAME="Second Salary Capital"), guardrail gate on every send, server-side templates.
- Collections: users, user_sessions, founder_applications, investor_registrations, contact_messages.

## Implemented (2026-09-21)
- 9 pages: Home (kinetic hero, animated metrics, origin timeline, marquee, 4 pillars, 13 support
  cards preview, EPOHTECH section, founder/investor CTAs, insights), /build, /investors, /support,
  /epohtech, /story, /insights, /contact, /account (auth-gated dashboard).
- Founder application (21 fields) → MongoDB + confirmation email + optional team notify.
- Investor registration (13 fields) → MongoDB + confirmation email + optional team notify.
- Contact form + footer newsletter → MongoDB + confirmation email.
- Emergent Google sign-in, session cookie auth, /api/auth/me, /api/auth/logout, /api/my/activity.
- SEO meta tags, data-testid coverage, dark obsidian design system (Outfit + JetBrains Mono).

## Verified
- POST /api/applications/founder, /api/applications/investor, /api/contact → success + 202 email sends.
- /api/auth/me + /api/my/activity with bearer token; 401 unauthenticated.
- Browser: hero, metrics counters, founder form submit → success panel + toast; /account with session cookie renders user.

## Pending / Notes
- OWNER_NOTIFY_EMAIL is empty in backend/.env — team notification emails are skipped until the
  user provides their real team inbox. Applicant confirmation emails already work.
- Pitch deck field is a link input (no file storage yet — needs object-storage integration).
- Live Google OAuth round-trip not tested in-browser (requires a real Google account click-through);
  session/me/logout verified via minted test session.

## Backlog
- P0: Set OWNER_NOTIFY_EMAIL (user's real team email) to enable internal notifications.
- P1: Admin dashboard (applications/investors/ventures pipeline, statuses, analytics).
- P1: Founder/investor document upload (object storage) for pitch decks.
- P1: CMS for Insights articles (currently static content in code).
- P2: Ventures + ownership records + milestones/KPI entities (multi-venture platform per §31).
- P2: JARVIS internal AI agent (daily summaries, KPI monitoring, alerts).
- P2: Analytics dashboards (conversion, cost per qualified lead).
- P2: Dedicated campaign landing pages (/build-with-us, /invest-with-us aliases).
