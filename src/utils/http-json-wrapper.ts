/**
 * Lazy-defined type for abstract request body convertable to JSON
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AbstractRequestBody = Record<string, any> | any[] | string | number | boolean

/**
 * Abstract HTTP call response
 */
export type AbstractResponse = {
  status: number
  body: unknown
}

/**
 * List of non-idempotent HTTP methods
 */
export enum PostMethods {
  POST = 'POST',
  PUT = 'PUT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

/**
 * Optional parameters for POST calls
 */
export type PostOptions = {
  method?: PostMethods
}

/**
 * Simple fetch-based HTTP REST JSON client
 */
export default class HttpJsonWrapper {
  /**
   * API base URL
   */
  private baseUrl: string

  /**
   * Bearer token
   */
  private token: string

  constructor(baseUrl: string, token: string) {
    // Normalize the base URL with the trailing slash
    if (baseUrl[baseUrl.length - 1] === '/') this.baseUrl = baseUrl
    else this.baseUrl = baseUrl.concat('/')

    this.token = token
  }

  /**
   * Resolves a full URL for a defined endpoint
   * @param endpoint
   * @returns Full URL to the defined endpoint
   */
  private buildUrl(endpoint: string): URL {
    return new URL(this.baseUrl.concat(endpoint))
  }

  /**
   * Makes a GET request
   * @param endpoint Endpoint, relatively to base URL
   * @param [queryParameters] Query parameters
   * @returns Response from remote
   */
  public async get(endpoint: string, queryParameters: URLSearchParamsInit): Promise<AbstractResponse> {
    // Resolve a full URL to the endpoint
    const url = this.buildUrl(endpoint)

    // Append query parameters
    url.search = new URLSearchParams(queryParameters).toString()
    console.log(url.toString())

    // Build a headers object
    const headers = new Headers()
    headers.set('Authorization', `bearer ${this.token}`)

    // Make a query, then parse body as JSON
    const req = await fetch(url.toString(), { method: 'GET', headers })
    return { status: req.status, body: await req.json() }
  }

  /**
   * Makes a POST (or UPDATE, PUT, DELETE) request
   * @param endpoint Endpoint, relatively to base URL
   * @param [body] Request body
   * @returns Response from remote
   */
  public async post(
    endpoint: string,
    body: AbstractRequestBody = {},
    options: PostOptions = {},
  ): Promise<AbstractResponse> {
    // Resolve a full URL to the endpoint
    const url = this.buildUrl(endpoint)

    // Build a headers object
    const headers = new Headers()
    headers.set('Authorization', `bearer ${this.token}`)
    headers.set('Content-type', 'application/json')

    // Make a query, then parse body as JSON
    const req = await fetch(url.toString(), {
      method: options.method || PostMethods.POST,
      headers,
      body: JSON.stringify(body),
    })
    return { status: req.status, body: await req.json() }
  }
}
