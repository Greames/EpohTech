# Hosting theepoh.com on Cloudflare Pages

The site moved from Netlify (free allowance used up, site paused) to
Cloudflare Pages. Email stays on **Zoho Mail** throughout.

| What | Where |
|---|---|
| Domain registration | Zoho (OpenSRS) — Zoho Mail admin → Domains → theepoh.com |
| Email | Zoho Mail (`mx.zoho.in`) |
| Website hosting | Cloudflare Pages, built from GitHub `Greames/EpohTech` (`main`) |
| DNS | Cloudflare (after step 4 below) |
| Contact-form leads | Web3Forms → emailed to `assist@theepoh.com` |

## What the code does

- `frontend/public/_redirects`: `/` opens `/epohtech`; old-site URLs
  (`/about-us`, `/our-services`, `/our-solutions`, `/solutions`, `/contact-us`,
  `/careers`, `/career`) redirect to their EPOHTECH pages. Unknown paths fall
  back to the app (Cloudflare Pages SPA mode — there is deliberately no
  `404.html`).
- The contact form posts to Web3Forms using the build variable
  `REACT_APP_WEB3FORMS_KEY`. Without it the form shows "Could not send. Please
  email assist@theepoh.com".
- `frontend/.node-version` pins Node 22 for the build.

## 1. Get a Web3Forms key (2 minutes)

1. Open https://web3forms.com and enter **assist@theepoh.com** under "Create
   your access key".
2. Open the email Web3Forms sends to that inbox and copy the **access key**.
   (It is safe to use in a public website; it only lets people send *to* you.)

## 2. Create the Cloudflare Pages project

1. Sign up / log in at https://dash.cloudflare.com (free plan).
2. **Workers & Pages → Create → Pages → Connect to Git**, authorise GitHub and
   pick **Greames/EpohTech**.
3. Build settings:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Framework preset | `Create React App` (or None) |
| Build command | `yarn build` |
| Build output directory | `build` |
| Root directory (advanced) | `frontend` |
| Environment variable | `REACT_APP_WEB3FORMS_KEY` = the key from step 1 |

4. **Save and Deploy**. When it finishes you get a test address like
   `https://epohtech.pages.dev`. Open it: it should go straight to the
   EPOHTECH home page. Submit one test enquiry and check that the email
   arrives at assist@theepoh.com.

## 3. Add theepoh.com to Cloudflare (DNS)

1. Cloudflare dashboard → **Add a domain** → `theepoh.com` → **Free** plan.
2. Cloudflare scans the existing records. On the review screen make sure
   these exist (add any that are missing, exactly):

| Type | Name | Value | Priority | Proxy |
|---|---|---|---|---|
| MX | `@` | `mx.zoho.in` | 10 | — |
| MX | `@` | `mx2.zoho.in` | 20 | — |
| MX | `@` | `mx3.zoho.in` | 50 | — |
| TXT | `@` | `v=spf1 include:zohomail.in -all` | | — |
| TXT | `@` | `google-site-verification=E7PvW-bsI82yyxvJFBq_5K06rJZ93kRdPSZUoeg9pds` | | — |
| TXT | `zoho._domainkey` | `v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQClSozszdHn1USfvapMNOEXEcTAKB+dOQ7OKe1JK/p8h8xMcbTY67ymq2eZZBQo/gWp6PhgfAjdS/Owjosj2R2jnz5qpnIqQ8cm6P4WZqfjo/onc2Acl5trnlwUWclF9o/JmtOg22ijfaWOSlRB2xD5amfz3SY7vwJWMU9IKX5cDwIDAQAB` | | — |

3. **Delete** any scanned `A`, `AAAA` or `CNAME` records for `theepoh.com` /
   `www` (they point at Netlify). Step 5 recreates the right ones.
4. Continue. Cloudflare shows **two nameservers** (like `xxx.ns.cloudflare.com`).

## 4. Point the domain at Cloudflare (Zoho)

1. Zoho Mail admin → Domains → theepoh.com → **Manage Your Domain** →
   **Name Servers/DNS → Manage Name Servers**.
2. Replace the four `dnsX.p07.nsone.net` (Netlify) entries with Cloudflare's
   two nameservers. Save.
3. Cloudflare emails you when the domain is **Active** (minutes to a few hours).

## 5. Connect the domain to the Pages project

1. Workers & Pages → your project → **Custom domains → Set up a custom domain**
   → `theepoh.com` → Activate. Repeat for `www.theepoh.com`.
2. Cloudflare creates the DNS records and the HTTPS certificate itself; this
   usually takes a few minutes once the domain is Active.

## 6. Check

- [ ] https://theepoh.com and https://www.theepoh.com open EPOHTECH with a padlock
      (try a private/incognito window).
- [ ] https://theepoh.com/about-us goes to the new About page.
- [ ] A contact-form enquiry arrives by email at assist@theepoh.com.
- [ ] Email to **and** from assist@theepoh.com still works.

## 7. Clean up Netlify

Once everything above works, delete the old Netlify project `epohtech`
(Project configuration → Danger zone) and the DNS zone under Netlify
**Domains → theepoh.com**, so nothing points at it any more.

## Rollback

Before step 4 nothing visitors see has changed. After step 4, putting the
Netlify nameservers (`dns1`–`dns4.p07.nsone.net`) back in Zoho reverses the
switch — but Netlify stays paused until its allowance resets or you upgrade.
