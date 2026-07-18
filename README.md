# nexedgestudios.com

The NexEdge Studios website. A single static HTML page, served by GitHub Pages.

## How it works

- `index.html` is the whole site. No frameworks, no build step, no external
  fonts or CDNs, so there is nothing that can break on its own.
- `CNAME` tells GitHub Pages to serve it at nexedgestudios.com.

## Editing it

Open `index.html`, change it, commit, push. That is the whole workflow.
GitHub Pages redeploys automatically, usually within a minute.

## DNS

The domain points at GitHub Pages. At the registrar:

- Four `A` records for the apex domain (`nexedgestudios.com`) pointing at
  GitHub Pages IP addresses
- One `CNAME` record for `www` pointing at `nexedgestudios.github.io`

Check the current IP addresses in GitHub's own docs before setting them, as
they can change:
https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site
