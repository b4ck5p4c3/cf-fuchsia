/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DNSRecord {
  id: string
  type: string
  name: string
  content: string
  proxiable: boolean
  proxied: boolean
  ttl: number
  locked: boolean
  zone_id: string
  zone_name: string
  created_on: Date
  modified_on: Date
  data: Record<string, any>
  meta: {
    auto_added: boolean
    source: string
  }
}

export interface ListDNSRecordsResponse {
  success: boolean
  errors: any[]
  messages: any[]
  result: DNSRecord[]
}

export interface UpdateDNSRecordResponse {
  success: boolean
  errors: any[]
  messages: any[]
  result: DNSRecord
}

export interface CreateDNSRecordResponse {
  success: boolean
  errors: any[]
  messages: any[]
  result: DNSRecord
}
