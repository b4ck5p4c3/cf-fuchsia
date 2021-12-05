export {}

declare global {
  /**
   * Shared PSK authenticating incomming API calls from Mikrotik
   */
  const API_BEARER: string

  /**
   * Cloudflare API token with DNS.Edit permission to the selected zone
   */
  const CF_API_TOKEN: string

  /**
   * Identifier of the assigned
   */
  const CF_ZONE_ID: string

  /**
   * Target records zone (suffix)
   * For instance, if record zone is set to "internal.0x08.in",
   * FQDN for devices will be "devicename.internal.0x08.in"
   */
  const CF_RECORD_ZONE: string
}
