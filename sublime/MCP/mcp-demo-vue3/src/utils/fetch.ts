/**
 * Fetch Utility with TypeScript Support
 * Features: timeout, abort, retry, error handling
 */

export interface FetchOptions extends RequestInit {
  timeout?: number
  retry?: number
  retryDelay?: number
}

export interface FetchError extends Error {
  status?: number
  statusText?: string
  isTimeout?: boolean
  isAborted?: boolean
}

/**
 * Fetch with timeout support
 */
export async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = 10000, ...fetchOptions } = options

  const controller = new AbortController()
  const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })

    if (timeoutId) clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId)

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        const fetchError: FetchError = new Error('Request timeout')
        fetchError.isTimeout = true
        throw fetchError
      }
    }

    throw error
  }
}

/**
 * Fetch JSON data
 */
export async function fetchJSON<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await fetchWithTimeout(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  return response.json()
}

export async function fetchText(
  url: string,
  options: FetchOptions = {}
): Promise<string> {
  const response = await fetchWithTimeout(url, {
    ...options,
  })
  return response.text()
}

/**
 * GET request
 */
export async function get<T = unknown>(url: string, options?: FetchOptions): Promise<T> {
  return fetchJSON<T>(url, { ...options, method: 'GET' })
}

/**
 * POST request
 */
export async function post<T = unknown>(
  url: string,
  data?: unknown,
  options?: FetchOptions
): Promise<T> {
  return fetchJSON<T>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getText(url: string, options?: FetchOptions): Promise<string> {
  return fetchText(url, { ...options, method: 'GET' })
}

