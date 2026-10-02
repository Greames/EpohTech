# Launching this site on theepoh.com

## Where things are today (checked 2 Oct 2026)

| What | Where |
|---|---|
| Domain registration | Zoho (where the domain was bought) |
| DNS (nameservers) | **SunlightHost**: `ns1`–`ns4.sunlighthost.com` |
| Old website | SunlightHost: `185.151.30.199` / `2a07:7800::199` |
| Email | **Zoho Mail** (`mx.zoho.in`) — must keep working |
| New website | Netlify project `epohtech` — https://epohtech.netlify.app/epohtech |

theepoh.com is already attached to the Netlify project; it just doesn't point
there yet. Going live means changing DNS.

## Already done in the code

- Netlify builds `frontend/` and serves it as a single-page app (`netlify.toml`).
- On theepoh.com, `/` redirects to the EPOHTECH home page (`/epohtech`).
- Old-site URLs redirect to their new pages: `/about-us`, `/our-services`,
  `/our-solutions`, `/solutions`, `/contact-us`, `/careers`, `/career`.
  Any other unknown path on theepoh.com lands on the EPOHTECH home page.
- EPOHTECH pages set their own browser titles and description.
- `robots.txt` and `sitemap.xml` point search engines at the EPOHTECH pages.
- The contact form sends leads to Netlify Forms (form `epoh-enquiry`).

## Recommended route: move DNS to Netlify

The DNS currently lives with SunlightHost, the old site's host. Moving it to
Netlify means you only need your **Zoho** and **Netlify** logins, and you can
cancel SunlightHost afterwards. (If you do have a SunlightHost login, the
alternative is to edit the A/AAAA records there instead — see the end.)

### 1. Before launch

- [ ] Review https://epohtech.netlify.app/epohtech on desktop and phone.
- [ ] Netlify → epohtech → **Forms → Form notifications → Add notification →
      Email**, form `epoh-enquiry`, to the inbox that should get leads. Send a
      test enquiry and confirm the email arrives.
- [ ] Content: Infolob logo, client permission to show names/logos, EPOHTECH
      privacy/terms (the footer currently links to Anvaya's).
- [ ] If you want a copy of the old site, ask SunlightHost for a backup now.

### 2. Set up the domain in Netlify DNS (nothing changes for visitors yet)

1. Netlify → **Domains** (team level) → **Add or register domain** →
   `theepoh.com` → choose to use **Netlify DNS**.
2. Netlify shows **four nameservers** (like `dns1.p0X.nsone.net`). Note them.
3. In the new DNS zone, **add the email records exactly as below** before
   switching. Without them, `assist@theepoh.com` stops receiving mail.

| Type | Name | Value | Priority |
|---|---|---|---|
| MX | `@` | `mx.zoho.in` | 10 |
| MX | `@` | `mx2.zoho.in` | 20 |
| MX | `@` | `mx3.zoho.in` | 50 |
| TXT | `@` | `v=spf1 include:zohomail.in -all` | |
| TXT | `@` | `google-site-verification=E7PvW-bsI82yyxvJFBq_5K06rJZ93kRdPSZUoeg9pds` | |
| TXT | `zoho._domainkey` | `v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQClSozszdHn1USfvapMNOEXEcTAKB+dOQ7OKe1JK/p8h8xMcbTY67ymq2eZZBQo/gWp6PhgfAjdS/Owjosj2R2jnz5qpnIqQ8cm6P4WZqfjo/onc2Acl5trnlwUWclF9o/JmtOg22ijfaWOSlRB2xD5amfz3SY7vwJWMU9IKX5cDwIDAQAB` | |

   Netlify adds the website records (`theepoh.com`, `www`) for the epohtech
   project by itself. The old `ftp`, `cpanel` and `webmail` names belong to the
   old host and are not needed.

### 3. Launch: change the nameservers at Zoho

- [ ] Log in to Zoho where the domain is managed (Zoho Domains, or the Zoho
      Mail admin console → Domains). Open `theepoh.com` → **Nameservers** →
      replace the four `sunlighthost.com` entries with Netlify's four.
- [ ] Wait. Most visitors switch within a few hours; it can take up to 48.
      Netlify issues the HTTPS certificate automatically once it sees the
      change (Domain management → HTTPS).

### 4. After launch

- [ ] https://theepoh.com and https://www.theepoh.com land on EPOHTECH over HTTPS.
- [ ] An old link such as https://theepoh.com/about-us goes to the new About page.
- [ ] Submit the contact form; the lead email arrives.
- [ ] Send a test email to **and** from `assist@theepoh.com`.
- [ ] Google Search Console: submit `https://theepoh.com/sitemap.xml`.
- [ ] After a couple of weeks with no issues, cancel the SunlightHost plan
      (keep email on Zoho — that's separate).

### Rollback

At Zoho, put the nameservers back to `ns1`–`ns4.sunlighthost.com`. Visitors
return to the old site as the change spreads (hours, not minutes).

## Alternative: keep DNS at SunlightHost

Only if you can log in to SunlightHost's control panel (StackCP/cPanel):
in its DNS editor change `theepoh.com` and `www` to Netlify — A `@` →
`75.2.60.5`, CNAME `www` → `epohtech.netlify.app` — and delete the AAAA
records (`2a07:7800::199`) and any wildcard `*` record. Leave MX and TXT
records alone. Rollback is putting the old values back.
