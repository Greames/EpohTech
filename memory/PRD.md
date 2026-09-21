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

## Implemented (2026-09-21, round 2)
- Team notifications: OWNER_NOTIFY_EMAIL=tulasi.reddy@theepoh.com — every founder application,
  investor registration and contact message emails the team inbox; reply-to set to same.
- Admin dashboard at /admin (unlisted, admin-only via ADMIN_EMAILS env): Overview stats,
  Founder Applications (status pipeline: submitted → screening → shortlisted → discovery →
  validation → founder_review → approved/rejected), Investor Registrations (verification_pending →
  verified → approved/rejected), Insights CMS (create/edit/publish/unpublish/delete), Messages.
  Account page shows "Admin Dashboard" shortcut when the signed-in user is an admin.
- Pitch deck upload: founders attach PDF/PPT/DOC (max 15MB) in the application form; stored in
  Emergent object storage (EMERGENT_LLM_KEY), metadata in db.files (soft-delete pattern); admins
  download via /api/admin/files/{file_id}/download.
- Insights CMS: articles live in db.insights; public GET /api/insights serves published articles;
  6 launch articles seeded on startup. Public InsightsSection fetches from API with code fallback.

## Implemented (2026-09-21, round 3)
- Status-change emails: admin pipeline moves (founder + investor) email the person automatically;
  verified/approved investors are told opportunities access is open.
- Venture Tracker: /admin → Ventures tab. Ventures CRUD (name, industry, stage, capital required,
  founder, status, investor-visibility), milestones with due dates + overdue highlighting,
  cap table rows (party / type / %) with live allocation total. Collections: ventures, milestones,
  ownership.
- Investor Portal: /opportunities — verified/approved investors (matched by Google sign-in email)
  see investor-visible ventures with stage, capital, founder, milestone progress; Express Interest
  stores to db.interests and emails the team. Unverified → 403 with verification-pending screen.
  Account page links to /opportunities once verified.
- JARVIS Digest: POST /api/admin/jarvis/digest generates an AI digest (gpt-5.4 via emergentintegrations,
  streamed + accumulated; plain fallback if LLM fails) covering 24h applications/registrations/messages/
  interests, overdue + upcoming milestones, pipeline counts; emailed to the team inbox; auto-scheduler
  runs daily 07:00 UTC while the pod is up; runs logged to db.jarvis_runs. Admin Overview has a
  "Send Now" button with inline preview.

## Implemented (2026-09-21, round 4)
- Venture Documents: admin uploads decks/financials/docs per venture (PDF/PPT/DOC/XLS/CSV, 25MB,
  object storage, db.documents soft-delete); verified investors see and download them on
  /opportunities (only for investor-visible ventures); admin download via /api/admin/documents.
- Portfolio KPIs: monthly revenue + growth% per venture (db.kpis); KPI chips on each venture card;
  Portfolio Revenue line chart (recharts) on admin Overview aggregating all ventures by month.
- Interest Alerts: express-interest now triggers an INSTANT AI-written JARVIS alert email to the
  team inbox (2-3 sentence summary + next step, plain fallback if LLM fails), in addition to the
  daily digest.
- Founder Portal: /my-venture — founders sign in with Google; venture linked via founder_email
  field on the venture (set in admin venture editor); shows stage/status, milestones with overdue
  flags, and tasks the founder can check off (PATCH /api/my/tasks, owner-or-admin only).
  Account page links to it.

## Pending / Notes
- Live Google OAuth round-trip not tested in-browser (needs a real Google account); all auth paths
  verified via minted test sessions (admin, verified investor, founder).
- The daily scheduler runs inside the backend process — if the pod is down at 07:00 UTC that day's
  digest is skipped; the manual Send Now button always works.
- Test data cleaned; DB starts fresh (insights re-seed automatically if emptied).

## Backlog
- P1: Investor NDA/acknowledgement step before viewing sensitive opportunity details.
- P1: Venture document visibility per-document (currently all docs follow venture visibility).
- P2: JARVIS expansions — KPI anomaly alerts, weekly investor summary, application triage scoring.
- P2: Analytics dashboards (conversion, cost per qualified lead).
- P2: Dedicated campaign landing pages (/build-with-us, /invest-with-us aliases).
- P2: Founder-facing document upload (founder shares files back with the studio).
