# raph-docs

Documentation site for [raph](https://github.com/tesh254/raph) — a local-first
graph-vector brain for coding agents. Built with [Astro
Starlight](https://starlight.astro.build) and deployed to Cloudflare Pages.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Deploy

Pushes to `main` deploy to Cloudflare Pages via GitHub Actions
(`.github/workflows/deploy.yml`). Set these repository secrets:

- `CLOUDFLARE_API_TOKEN` — a token with the **Cloudflare Pages: Edit** permission.
- `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account id.

The Pages project is named `raph-docs` (see `wrangler.toml`). You can also
deploy manually:

```bash
npx wrangler pages deploy dist --project-name=raph-docs
```
