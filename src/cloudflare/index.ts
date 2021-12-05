import HttpJsonWrapper, { PostMethods } from '../utils/http-json-wrapper'
import { DNSRecord, ListDNSRecordsResponse, CreateDNSRecordResponse, UpdateDNSRecordResponse } from './responses'

/**
 * Types of DNS records
 */
export type RecordTypes =
  | 'A'
  | 'AAAA'
  | 'CNAME'
  | 'HTTPS'
  | 'TXT'
  | 'SRV'
  | 'LOC'
  | 'MX'
  | 'NS'
  | 'SPF'
  | 'CERT'
  | 'DNSKEY'
  | 'DS'
  | 'NAPTR'
  | 'SMIMEA'
  | 'SSHFP'
  | 'SVCB'
  | 'TLSA'
  | 'URI read only'

/**
 * Possible upsert actions
 */
export type UpsertRecordAction = 'CREATED' | 'UPDATED'

/**
 * Record upsert method result
 */
export type UpsertRecordResult = {
  /**
   * Type of action performed to upsert this record
   */
  action: UpsertRecordAction

  /**
   * Record properties
   */
  record: DNSRecord
}

/**
 * Partial wrapper over Cloudflare API calls
 */
export default class CloudflareWrapper {
  /**
   * Cloudflare Zone ID
   */
  public zoneId: string

  /**
   * Instance of HTTP API wrapper
   */
  private http: HttpJsonWrapper

  /**
   * Creates a CF API instance
   * @param token Cloudflare API token
   * @param zoneId Target zone ID
   */
  constructor(token: string, zoneId: string) {
    this.zoneId = zoneId
    this.http = new HttpJsonWrapper('https://api.cloudflare.com/client/v4/', token)
  }

  /**
   * Returns DNS records matching criteria
   * @param name
   * @param type
   * @returns
   */
  async getRecords(name: string, type: RecordTypes): Promise<DNSRecord[]> {
    const { status, body } = await this.http.get(`zones/${this.zoneId}/dns_records`, {
      name,
      type,
      proxied: 'false',
    })

    const recordResponse: ListDNSRecordsResponse = body as ListDNSRecordsResponse
    if (!recordResponse.success) {
      throw new Error(`Failure response from server: ${JSON.stringify(recordResponse?.errors || status)}`)
    }

    return recordResponse.result
  }

  /**
   * Updates a specific DNS record
   * @param id Cloudflare Record ID
   * @param type Record type
   * @param name Record name
   * @param ttl Record TTL in seconds
   * @param target Record content
   * @returns Updated record state
   */
  async updateRecord(id: string, type: RecordTypes, name: string, ttl: number, target: string): Promise<DNSRecord> {
    const { status, body } = await this.http.post(
      `zones/${this.zoneId}/dns_records/${id}`,
      {
        type,
        name,
        ttl,
        content: target,
      },
      { method: PostMethods.PUT },
    )

    const recordResponse: UpdateDNSRecordResponse = body as UpdateDNSRecordResponse
    if (!recordResponse.success) {
      throw new Error(`Failure response from server: ${JSON.stringify(recordResponse?.errors || status)}`)
    }

    return recordResponse.result
  }

  /**
   * Creates a new record
   * @param type Record type
   * @param name Record name
   * @param ttl Record TTL in seconds
   * @param target Record content
   * @returns Created record
   */
  async createRecord(name: string, type: RecordTypes, target: string, ttl = 60): Promise<DNSRecord> {
    const { status, body } = await this.http.post(`zones/${this.zoneId}/dns_records`, {
      type,
      name,
      ttl,
      content: target,
    })

    const recordResponse: CreateDNSRecordResponse = body as CreateDNSRecordResponse
    if (!recordResponse.success) {
      throw new Error(`Failure response from server: ${JSON.stringify(recordResponse?.errors || status)}`)
    }

    return recordResponse.result
  }

  /**
   * Upserts a single record
   * @param name
   * @param type
   * @param target
   * @returns Upserted record properties
   */
  async upsertRecord(name: string, type: RecordTypes, target: string): Promise<UpsertRecordResult> {
    const targetRecords = await this.getRecords(name, type)

    // Modify existing record matching the criteria
    if (targetRecords.length > 0) {
      // For now, multiple records for a single name are not supported,
      // so we're always picking the first one
      const [recordToUpdate] = targetRecords
      const updatedRecord = await this.updateRecord(
        recordToUpdate.id,
        recordToUpdate.type as RecordTypes,
        recordToUpdate.name,
        recordToUpdate.ttl,
        target,
      )

      return { action: 'UPDATED', record: updatedRecord }
    }

    // Create a new record
    const newRecord = await this.createRecord(name, type, target)
    return { action: 'CREATED', record: newRecord }
  }
}
