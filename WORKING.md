# nexedgestudios.com — how this site works

> 🛑 **Read this before editing anything.** Written 2026-07-18 at the end of the
> session that built the site. If something looks pointless here, it is a
> QUESTION, not a bug — ask Paul before changing it.

---

## What this is

The public site for **NexEdge Studios**, live at **https://nexedgestudios.com**.

- **Repo:** `github.com/nexedgestudios/nexedgestudios.com` (public — it must be
  public, GitHub Pages from a private repo needs a paid plan)
- **Local:** `Core_Memory/Projects/nexedgestudios-site/`
- This folder is its **own git repo**. Core_Memory's `.gitignore` excludes it so
  the two repos do not fight.

## Core principle: nothing that can rot

There is **no framework, no build step, no package manager, no webfonts, no
CDN, no external images**. Plain HTML, one CSS file, one JS file. The whole
site is a few tens of KB and makes **zero external requests**.

This is deliberate and matches how Paul builds: he is the only maintainer, and a
dependency that breaks in a year costs him time he does not have. **Do not
introduce Tailwind, Google Fonts, icon fonts or a static site generator without
asking him first.**

Measured: home page ~8 KB, average response 49 ms.

---

## File layout

```
/index.html            home
/compare/index.html    comparison tool  (+ compare.json = its data)
/deals/index.html      deals            (affiliate disclosure lives here)
/resources/index.html  free tools we published
/team/index.html       Paul + Britton
/shop/index.html       coming soon
/copyright/index.html  copyright, trademark, licensing
/404.html              served automatically by GitHub Pages on a bad URL
/assets/site.css       EVERY page's styling
/assets/site.js        EVERY page's behaviour
/assets/team/          drop paul.jpg and britton.jpg here
/CNAME                 nexedgestudios.com  — DO NOT DELETE
```

**Edit `assets/site.css` and `assets/site.js`, never per-page copies.**
The nav, slide-out panel and footer markup **are** duplicated in each page —
that is the price of having no build step. Change one, change all of them.

---

## Brand

- **Wordmark:** `NEXEDGE<b> TECH</b>` — TECH renders in red.
- **Colours:** red `#ee2b39` on near-black `#0b0d12`. **Paul corrected an
  earlier blue version — the brand is red and dark grey/black.**
- **Headline:** "GEAR THAT FITS **YOUR BUDGET**", with the hand-drawn ring
  around the last two words. Paul rejected "Tech you can afford" because
  affordability is subjective.
- **Positioning:** value gaming and streaming gear, budget PC builds, honest
  comparisons matched to a budget, Amazon affiliate deals. Resources are given
  away **free with no subscriptions** — that is the differentiator.
- **The line that carries it:** "While everything else keeps getting more
  expensive, *we are heading the opposite direction*." A contrast, not a
  complaint. Paul's own framing.
- **Microcopy under the CTA:** "No sign-up. No email required. Nothing to
  cancel." **This is a promise — do not add a newsletter signup.**
- NexEdge Tech is the tech brand of NexEdge Studios (parent). Footer says so.

---

## Things that will bite you

**The hand-drawn ring must measure its own path.** `stroke-dasharray` is set in
JS from `getTotalLength()`. A hardcoded value shorter than the path leaves the
circle visibly unfinished — that happened. The left overhang is kept small
(`left:-5%`) and `--gutter` is 30px so the first letter is never clipped by
`overflow-x:hidden`.

**`[hidden]` needs `display:none !important`.** Any element with an explicit
`display:flex` or `grid` ignores the `hidden` attribute. This is in site.css
near the top. Removing it makes hidden filter rows reappear empty.

**GitHub Pages CDN serves stale copies for a minute or two after a push.**
Check with `?v=2` on the URL, or hard-refresh. CSS is cached ~10 minutes.
More than once this looked like a broken deploy when it was just cache.

**Never delete `CNAME`.** It is what binds the custom domain.

**If the HTTPS certificate ever gets stuck** ("The certificate does not exist
yet"), force a fresh request:
```
gh api -X PUT repos/nexedgestudios/nexedgestudios.com/pages -F "cname="
# wait ~20s
gh api -X PUT repos/nexedgestudios/nexedgestudios.com/pages -F "cname=nexedgestudios.com"
# wait ~60s, then
gh api -X PUT repos/nexedgestudios/nexedgestudios.com/pages -F "https_enforced=true"
```
Before doing that, rule out **stale AAAA records** (phones prefer IPv6) and a
**CAA record** blocking Let's Encrypt. Both were clean here.

---

## Brand assets and favicons

Source logo: **`assets/brand/net-logo.png`** (1500x1500, red NET mark, **already
transparent**). A pristine copy plus every generated size lives in
**`brand-source/`**.

Generated: `favicon.ico` (multi-size 16/32/48), `favicon-16`, `favicon-32`,
`icon-192`, `icon-512`, `apple-touch-icon` (180).

🚨 **Keep the transparency.** The first attempt called
`Graphics.Clear(background)` before drawing, which filled the alpha and produced
red-on-black squares. Clear to `Color::Transparent` instead.

**The one deliberate exception is `apple-touch-icon.png`, which keeps a solid
background** — iOS ignores alpha on touch icons and composites them itself, so
an explicit background renders predictably on a home screen.

The logo also appears inline in the nav, the slide-out panel header and the
footer, via `.word img` in site.css.

## Social links — all verified, never invent these

```
YouTube    https://www.youtube.com/@NexEdgeTech
X          https://x.com/nexedgestudios
Instagram  https://www.instagram.com/nexedgetech
```
Also real but not yet on the site: `tiktok.com/@nexedgetech`,
`twitch.tv/nexedgetech`.

Note the split: **channels are `nexedgetech`, X is `nexedgestudios`** because
the other handle was taken. Icons sit top-right in `.social`.

## ⚠️ copyright/index.html is the odd one out

It was written before the CSS was extracted, so it has **its own inline
`<style>` and does not load `site.css`**. Anything added to the shared
stylesheet must be duplicated there by hand — that already caught the `.social`
and `.word img` rules. Worth converting it to the shared sheet one day.

## Two ways this bit me, both avoidable

**Extracting CSS silently dropped rules.** `.social` existed in the original
single-file page and never made it into `assets/site.css`. The icons sat in the
HTML with no styling and stacked vertically. After any extraction, check the
classes still resolve.

**PowerShell has reserved variables.** `$home = Get-Content ...` fails silently
because `$HOME` is read-only, so a later `Set-Content -Value $home` wrote the
*home directory path* over `index.html` and destroyed it. Recovered with
`git checkout -- index.html` because the good version had just been pushed.
**Use the Edit tool for text surgery, not PowerShell string replacement**, and
avoid `$home`, `$input`, `$args`, `$error`.

## DNS (Squarespace)

The domain is at **Squarespace Domains**. Its DNS panel warns "You're using
custom nameservers… records below won't be active" — **that warning is
misleading**, the records are live.

- Apex `@` → four A records: `185.199.108.153` `.109.153` `.110.153` `.111.153`
- `www` → CNAME → `nexedgestudios.github.io` (org name, **not** the repo name)
- The **"Squarespace Defaults" preset must stay deleted.** It re-adds parking A
  records that round-robin against GitHub's and make the site load
  intermittently.

🛑 **Never touch these:** the `Google Workspace` MX preset (that is
contact@nexedgestudios.com), the `Domain Connect to Google` TXT
(site verification), or the `_domainconnect` CNAME.

⚠️ **Outstanding:** the domain has **no SPF record**. Google Workspace wants
`v=spf1 include:_spf.google.com ~all` or outbound mail is likelier to hit spam.
Flagged to Paul, not done.

---

## The comparison tool

`/compare/` renders entirely from **`compare/compare.json`**. To add a product
you edit that file only — never the page. Paul can do it from his phone in
GitHub's web editor.

Three filter rows: **Budget** → **Category** → **Type**. The Type row only
appears once a category is picked, and only lists types belonging to it.
Two views: **Chart** (side-by-side table, default) and **Cards**.

The chart groups by `type` and titles itself from the type's label, e.g.
"MMO Mice". Spec rows are the **union** of every key in the group, so a spec one
product lacks still gets a row showing `—`.

### Rules that are not negotiable

**No prices, ever.** Amazon requires displayed prices to be refreshed or removed
within 24 hours. Link out and let Amazon show the live price. Use the budget
band for context.

**Affiliate tag: `nexedge-20`.** It lives in one place in the JSON, and **buy
buttons do not render at all while it is empty** — that gates against shipping
untagged links that earn nothing. Links carry `rel="sponsored nofollow
noopener"`. The `-20` suffix is **US-only**.

**Disclosure is legally required** (Amazon Associates + FTC) and must sit near
the links, not buried in a footer. It is on `/deals/` and `/compare/`.

**Verdicts are Paul's, not Claude's.** A verdict implies hands-on testing.
Paul decided the page is specs-only so readers choose for themselves — the page
copy was reworded to match, because it previously promised "we'll tell you
straight which one is worth it".

### 🚨 Where specs come from

**Take specs from each product's own Amazon TITLE, or from the manufacturer.
Do NOT scrape Amazon's "Features & Specs" table** — on listings with variants it
reports a *different* variant. Both proven here:

- UtechSmart Venus: table said Bluetooth / wireless / 70hr, its own title said
  **wired**.
- Redragon M901K: table said "Battery 30 hours" and "16K DPI" on a mouse whose
  Power Source is "Corded Electric" and whose title says 12,400 DPI.

Cross-check anything that looks odd. Publishing wrong specs on a site whose
whole pitch is honesty is the worst possible own goal.

⚠️ **PowerShell's `ConvertTo-Json` mangles `compare.json`** (bad indentation,
`'` for apostrophes). Edit it by hand or with the Edit tool — never
round-trip it through PowerShell.

---

## Testing it locally

`fetch()` will not work from `file://`, and the Chrome tooling refuses
`file://` URLs anyway. Run a server:

```
node -e "const h=require('http'),f=require('fs'),p=require('path');const r='<abs path>';h.createServer((q,s)=>{let u=decodeURIComponent(q.url.split('?')[0]);if(u.endsWith('/'))u+='index.html';const fp=p.join(r,u);f.readFile(fp,(e,d)=>{if(e){s.writeHead(404);return s.end('nope')}const t=fp.endsWith('.css')?'text/css':fp.endsWith('.js')?'text/javascript':fp.endsWith('.json')?'application/json':'text/html';s.writeHead(200,{'Content-Type':t});s.end(d)})}).listen(8733)"
```

Run it with `run_in_background: true`, and copy the site to a path with **no
apostrophes or spaces** (Paul's real path has both and it breaks things).

---

## Still outstanding

- **Bios for Paul and Britton** — both say "Bio to come". Claude will not write
  Britton's, nor publish Paul's personal details without his say-so.
- **Team photos** → `assets/team/paul.jpg`, `britton.jpg`. Initials show until
  then.
- **YouTube and Instagram URLs** — the social icon styling is in place and
  commented out in the nav, waiting on real links. **Never invent a URL.**
- **Social proof** — Paul chose *real viewer comments* and *the PC build he did
  for Britton's wife*. Both need his material and her permission. **No invented
  testimonials, ever** — an AI-generated mock he pasted was full of them and
  they were refused.
- **SPF record** (see DNS).
- **Budget bands for the Razer and Corsair are estimates**, unverified.
- **`preview/` still exists** and duplicates the old single-file home page. It
  will drift. Delete it when Paul says so.
- **Shop** is a coming-soon page. A real shop cannot run on GitHub Pages
  (static only) — it would be a hosted platform on `store.nexedgestudios.com`,
  or simpler, Stripe Payment Links / Gumroad embedded right in a page.

---

## Deploy

```
cd Core_Memory/Projects/nexedgestudios-site
git add -A
git commit -m "what changed"
git push
```
GitHub Pages rebuilds automatically, usually within a minute. Then check with a
cache-busting query string.
