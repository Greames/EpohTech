# Launching this site on theepoh.com

theepoh.com currently points to the old "Epoh Tech Solutions" site on another
host. This site is already deployed on Netlify (project `epohtech`) and
theepoh.com is attached to that project, but the domain's DNS still points to
the old host (`2a07:7800::199`). Go-live is a DNS change.

## Already done in the code

- Netlify builds `frontend/` and serves it as a single-page app (`netlify.toml`).
- On theepoh.com, `/` redirects to the EPOHTECH home page (`/epohtech`).
- Old-site URLs redirect to their new pages: `/about-us`, `/our-services`,
  `/our-solutions`, `/solutions`, `/contact-us`, `/careers`, `/career`.
  Any other unknown path on theepoh.com lands on the EPOHTECH home page.
- EPOHTECH pages set their own browser titles and description.
- `robots.txt` and `sitemap.xml` point search engines at the EPOHTECH pages.
- The contact form sends leads to Netlify Forms (form `epoh-enquiry`).

## 1. Before launch

- [ ] Merge the open PR(s) and check https://epohtech.netlify.app/epohtech
      page by page on desktop and phone.
- [ ] Netlify → epohtech → **Forms**: `epoh-enquiry` is listed.
- [ ] **Forms → Form notifications → Add notification → Email**, form
      `epoh-enquiry`, to the inbox that should receive leads. Send a test
      enquiry and confirm the email arrives.
- [ ] Content: Infolob logo, client permission to show names/logos, internship
      wording, EPOHTECH privacy/terms (the footer currently links to Anvaya's).
- [ ] Compare the old site's page addresses with the redirect list above and
      tell the developer about any other pages that need redirecting.
- [ ] Take a backup/export of the old site from its current host.

## 2. One day before

- [ ] At the DNS provider, **write down the current records** for `theepoh.com`
      and `www` (A, AAAA, CNAME). These are the rollback values.
- [ ] Lower the TTL on those records to 300 seconds (5 minutes) so the switch
      and any rollback take effect quickly.

## 3. Launch (DNS change)

In Netlify → epohtech → **Domain management**, confirm `theepoh.com` and
`www.theepoh.com` are both listed, and use the exact values Netlify shows.
Typically:

| Record | Host | Value |
|---|---|---|
| A | `@` (theepoh.com) | `75.2.60.5` |
| CNAME | `www` | `epohtech.netlify.app` |

- [ ] Delete the old **AAAA** record for `@` (`2a07:7800::199`) and any old A
      records, or some visitors will still reach the old site.
- [ ] **Do not change MX, TXT (SPF/DKIM/DMARC) or other mail records** —
      `assist@theepoh.com` must keep working.
- [ ] Netlify issues the HTTPS certificate automatically once DNS resolves
      (Domain management → HTTPS). Wait until it shows as active.

## 4. After launch

- [ ] Open https://theepoh.com and https://www.theepoh.com — both should land on
      the EPOHTECH home page over HTTPS.
- [ ] Try an old link such as https://theepoh.com/about-us.
- [ ] Submit the contact form once and confirm the lead email.
- [ ] Send a test email to and from `assist@theepoh.com`.
- [ ] Google Search Console: verify theepoh.com and submit
      `https://theepoh.com/sitemap.xml`.
- [ ] After a week with no issues, raise the DNS TTL back (e.g. 3600).

## Rollback

Put back the A/AAAA/CNAME values written down in step 2. With a 300-second TTL,
most visitors are back on the old site within minutes.
