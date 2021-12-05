import { ThrowableRouter, status, json, error } from 'itty-router-extras'
import CloudflareWrapper from '../cloudflare'

/**
 * Application-wide router instance
 */
const router = ThrowableRouter()

/**
 * Cloudflare API wrapper
 */
const cloudflare = new CloudflareWrapper(CF_API_TOKEN, CF_ZONE_ID)

// Upserting a new record
router.post('/update-entry', async (request) => {
  if (!request.json) return error(400, 'Incorrect request body')

  const body = await request.json()
  if (typeof body.name !== 'string' || typeof body.target !== 'string') return error(400, 'Incorrect request body')

  // Verify that record name is correct
  if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(body.name)) return error(400, 'Incorrect record name')

  // Verify that target is valid IPv4 entry (for now, we support only "A" records)
  if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/.test(body.target))
    return error(400, 'Incorrect content IP address')

  // Create a FQDN for this record
  const recordFullName = `${body.name}.${CF_RECORD_ZONE}`
  const upsertResult = await cloudflare.upsertRecord(recordFullName, 'A', body.target)
  return json(upsertResult)
})

// Catch-all route for unhandled requests
router.all('*', () => status(404, 'Unknown action'))

export default router
