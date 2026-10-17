// the one place that talks to the backend. every service uses request()

const TOKEN_KEY = 'retain.token'

// the login token stays in the browser, so a refresh does not sign the person out
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// an error that came from the backend, or from not reaching it
export class ApiError extends Error {
  // a short name for the problem, like EMAIL_TAKEN
  code: string
  // the http status, like 401. it is 0 when the backend could not be reached
  status: number
  // for form errors: a message for each wrong field
  fields?: Record<string, string>

  constructor(message: string, code: string, status: number, fields?: Record<string, string>) {
    super(message)
    this.code = code
    this.status = status
    this.fields = fields
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  // sent as JSON
  body?: unknown
  // added to the address, like ?page=2. empty values are left out
  query?: Record<string, string | number | null | undefined>
}

// sends a request to the backend and gives back the data of the reply.
// when the backend answers with an error, it throws an ApiError
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const backendUrl = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '')
  if (!backendUrl) {
    throw new ApiError('VITE_BACKEND_URL is missing in the .env file', 'NO_BACKEND_URL', 0)
  }

  // build the address, like /api/expenses?page=2&search=rent
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value))
    }
  }
  const queryText = params.toString()
  const url = backendUrl + path + (queryText ? '?' + queryText : '')

  const headers: Record<string, string> = {}
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  const token = getToken()
  if (token) {
    headers.Authorization = 'Bearer ' + token
  }

  let response: Response
  try {
    response = await fetch(url, {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    })
  } catch {
    throw new ApiError('Could not reach the server. Check your internet and try again', 'NETWORK_ERROR', 0)
  }

  let reply
  try {
    reply = await response.json()
  } catch {
    throw new ApiError('The server sent an answer we could not read', 'BAD_REPLY', response.status)
  }

  if (!reply.success) {
    const error = reply.error ?? {}
    throw new ApiError(
      error.message ?? 'Something went wrong',
      error.code ?? 'SERVER_ERROR',
      response.status,
      error.fields,
    )
  }

  return reply.data as T
}
