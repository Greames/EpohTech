# Anvaya Partners — PRD

## Current Brand (2026-09-22 rebrand — supersedes "Second Salary Capital")
Anvaya Partners (ALWAYS in full, never just "Anvaya"). Legal: Anvaya Partners Private Limited,
[City], India. Tagline: "Where capital meets founders." Name: Anvaya (अन्वय) = Sanskrit for
"bringing together" — founders with ambition, investors with conviction, a partner committed to both.
Early-stage investment firm investing its OWN capital, hands-on with founders on strategy,
technology, finance, operations, go-to-market. Primary audience: mainstream investors; secondary:
founders. Tone: premium, calm, credible, institutional. No hype.

## Business Rules (legal — India)
- NEVER publicly list fundraising terms, amounts, valuations or share prices of any company.
- NO "Invest now" buttons, payment gateways or online investment transactions.
- Investor CTAs: only "Request Deck" or "Apply to Join the Network" (manual review).
- Opportunities shared only privately with verified investors.
- Site-wide disclaimer (short in footer, full at /disclaimer); Privacy Policy (DPDP Act 2023) at
  /privacy; Terms of Use at /terms — all marked [To be reviewed by legal counsel].
- Every form has a consent checkbox linked to /privacy (founder, investor, contact, deck request,
  newsletter).
- Placeholders kept in [square brackets]: [Founder Name], [email], [phone], [City], [LinkedIn URL],
  [Company 1/2 — one-line description].

## Track Record / Portfolio
- EPOHTECH: own technology platform + technology partner to all portfolio companies.
  ₹1.5 Cr revenue in 2 years, capital-efficient, less investment. Shown as proof of the model.
- 2 more startups launching 2026 (placeholders on /portfolio).

## Architecture
- React + Tailwind + framer-motion + Lenis; FastAPI + MongoDB; routes under /api.
- Auth: Emergent Google OAuth (session cookie). Roles: admin (ADMIN_EMAILS), verified investor,
  founder (linked by founder_email on venture).
- Email: Emergent managed Resend proxy — confirmations, team notifications (OWNER_NOTIFY_EMAIL),
  status-change emails, instant AI interest alerts, JARVIS daily digest (gpt-5.4, 07:00 UTC +
  manual Send Now in admin).
- Storage: Emergent object storage for founder pitch decks + venture documents.
- Collections: users, user_sessions, founder_applications, investor_registrations, contact_messages
  (incl. deck requests), ventures, milestones, ownership, kpis, tasks, documents, interests,
  insights, files, jarvis_runs.

## Pages (public)
/ (hero "Where capital meets founders", अन्वय name meaning, approach pillars + process + values,
two-audience doors, EPOHTECH track record + portfolio preview, team preview, insights),
/about, /approach, /portfolio, /founders (application + deck upload), /investors (two paths,
Request Deck modal, network application, FAQ), /team, /insights (DB-backed CMS), /contact,
/privacy, /terms, /disclaimer.
Platform: /account, /admin (overview+chart, ventures w/ milestones/tasks/captable/KPIs/documents,
applications, investors, insights CMS, messages, JARVIS), /opportunities (verified investors),
/my-venture (founder workspace). WhatsApp button: +91 96401 08029.

## Verified (2026-09-25)
- Rebrand: zero "Second Salary"/old-brand strings remain in frontend/backend (grep-verified).
- Insights reseeded with 6 Anvaya articles; founder/investor/contact+deck-request submissions work
  with consent; all confirmation emails accepted (202) with Anvaya Partners branding.
- UI: hero, name-meaning (अन्वय), EPOHTECH proof card, investor two-path cards, Request Deck modal
  with consent, disclaimer page, footer legal links + short disclaimer — all screenshot-verified.

## Pending Placeholders For User
FILLED (2026-09-25): Founder = Tulasi Reddy (Team page, homepage leadership card, privacy
grievance officer); email = tulasi.reddu@anvayapartners.in (NOTE: "reddu" spelled exactly as user
provided — confirm not a typo of "reddy"); city = Hyderabad everywhere incl. email footers;
legal pages dated September 2026; /epohtech dedicated page live (₹1.5 Cr / 2 years / less
investment story, capabilities, founder + investor panels; linked from homepage, about, portfolio,
footer).
STILL PLACEHOLDER: [phone], [LinkedIn URL].
INSIGHTS: 7 articles in DB incl. "Plan In, Price Out: How the Volt & Valve Estimator Works"
(category: Portfolio, published 2026-09-25 via admin API).
FILLED (2026-09-25, later): Company 1 = Dawn Fresh — "Wholesale meat distribution to restaurants
from a single processing unit — franchise model planned, 1–2 units per district (every 20–30 km)";
Company 2 = Volt & Valve — "Plumbing, electrical and painting works for new homes and commercial
spaces — estimator tool turns an uploaded floor plan into a clear, upfront price and scope of work."
Portfolio page is now placeholder-free except [phone]/[LinkedIn URL] on contact/legal pages.
NOTE: team notifications still go to tulasi.reddy@theepoh.com (OWNER_NOTIFY_EMAIL) — ask user
whether to switch to the anvayapartners.in address.
Legal counsel must review /privacy, /terms, /disclaimer before go-live.

## Backlog
- P1: Replace bracketed placeholders with real details.
- P1: Legal counsel review of the three legal pages.
- P2: Founder photos on /team; LinkedIn/social links in footer.
- P2: JARVIS KPI anomaly alerts; weekly investor recap email.
