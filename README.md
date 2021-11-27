# Fuchsia
Lambda responsible for cloning a local split-horizon DNS to Cloudflare.

## Pre-requirements
1. Adjust `wrangler.toml` to your environment.
1. Set API Bearer token via `wrangler secret put API_BEARER`.

## Installation & deployment
1. Install [Wrangler](https://developers.cloudflare.com/workers/cli-wrangler)
2. Install dependencies with `npm ci`
3. Debug and develop locally with `wrangler dev`
4. Deploy with `wrangler deploy`
