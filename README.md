# nexedgestudios.com

The NexEdge Studios website. Static, served by GitHub Pages at
**https://nexedgestudios.com**.

Seven pages — home, compare, deals, resources, team, shop, copyright — sharing one CSS file and
one JS file. No framework, no build step, no package manager, no webfonts, no CDN, no external
images. **Zero external requests.** That is deliberate: there is nothing here that can break on
its own.

## 📖 The documentation is NOT in this repo

This repo is **public**, so the plan and the working notes live in Core Memory instead:

```
Core_Memory/Projects/nexedge-studios/
  ROADMAP.md     everything planned and everything done - the full list
  BEHAVIOR.md    what the site is for, the brand, and the rules that do not bend
  CHANGELOG.md   what shipped and why
  CLAUDE.md      file layout, gotchas, DNS, deploy, testing
```

**Read `BEHAVIOR.md` before changing anything.** It carries rules that are not obvious from the
code and are expensive to get wrong — among them: **no prices are ever displayed** (Amazon
requires them refreshed or removed within 24 hours, so the site shows a budget band and links
out), specs come from a product's Amazon **title** or the manufacturer and **never** the
"Features & Specs" table, and the "No sign-up. No email required." line is a promise, so there
is no newsletter.

## Editing it

Edit `assets/site.css` and `assets/site.js`, never per-page copies. The nav, slide-out panel and
footer markup **are** duplicated in every page — that is the price of having no build step, so
change one and change all of them.

To add a product to the comparison tool, edit **`compare/compare.json`** only, never the page.
That works from a phone in GitHub's web editor.

⚠️ **Never delete `CNAME`** — it binds the custom domain.

## Deploy

Commit and push. Pages rebuilds in about a minute, then **confirm against the live URL** rather
than assuming; the CDN serves stale copies for a minute or two after a push.
