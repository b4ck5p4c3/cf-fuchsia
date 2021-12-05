# Fuchsia
Lambda responsible for cloning a local DNS records (based on pinned/static DHCP-leases) to Cloudflare.

## Pre-requirements
1. Adjust `wrangler.toml` to your environment.
2. Set API Bearer token via `wrangler secret put API_BEARER`.
3. Set Cloudflare API token (with DNS-Edit permission) via `wrangler secret put CF_API_TOKEN`
4. Set target Zone ID via `wrangler secret put CF_ZONE_ID`
5. Set record zone (suffix, example: "internal.0x08.in" for devices on "xxxx.internal.0x08.in") via `wrangler secret put CF_RECORD_ZONE`

## Installation & deployment
1. Install [Wrangler](https://developers.cloudflare.com/workers/cli-wrangler)
2. Install dependencies with `npm ci`
3. Debug and develop locally with `wrangler dev`
4. Deploy with `wrangler deploy`

## Mikrotik configuration
1. Download and import Cloudflare API root certificates.
2. Adjust and copy the content of `mikrotik/dhcp-lease-script.ros` as DHCP Server's lease script.
