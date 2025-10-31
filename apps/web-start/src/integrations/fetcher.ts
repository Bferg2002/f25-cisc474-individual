import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// ======================================================
// 🔹 Core types
// ======================================================
export type Grade = {
  userId: number
  assignmentId: number
  late: boolean
  published: boolean
  grade: string
  score: number
  assignment: { id: number; name: string }
  user: { id: number; firstName: string; lastName: string }
}

export type Course = { id: number; name: string }

// ======================================================
// 🔹 Environment variables
// ======================================================
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE as string

type Json = Record<string, unknown> | Array<unknown>

class RedirectingForAuthError extends Error {
  constructor() {
    super('redirecting-for-auth')
    this.name = 'RedirectingForAuthError'
  }
}

// ======================================================
// 🔹 Auth0-enabled API client
// ======================================================
export function useApiClient() {
  const {
    getAccessTokenSilently,
    loginWithRedirect,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth0()

  const getToken = async (scope?: string) => {
    try {
      return await getAccessTokenSilently({
        authorizationParams: { audience: AUDIENCE, scope },
      })
    } catch (e: any) {
      if (e?.error === 'consent_required' || e?.error === 'login_required') {
        await loginWithRedirect({
          authorizationParams: { audience: AUDIENCE, scope, prompt: 'consent' },
          appState: { returnTo: window.location.pathname },
        })
        throw new RedirectingForAuthError()
      }
      throw e
    }
  }

  const request = async <T = unknown>(
    path: string,
    init: RequestInit & { scope?: string } = {},
  ): Promise<T> => {
    const token = await getToken(init.scope)
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
    })
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    return (await res.json()) as T
  }

  return { request, isAuthenticated, isAuthLoading }
}

// ======================================================
// 🔹 React Query helpers
// ======================================================
export function useApiQuery<T>(
  queryKey: ReadonlyArray<unknown>,
  path: string,
  init: RequestInit & { scope?: string } = {},
) {
  const { request, isAuthenticated, isAuthLoading } = useApiClient()
  const isEnabled = isAuthenticated && !isAuthLoading
  const q = useQuery({
    queryKey,
    queryFn: () => request<T>(path, init),
    enabled: isEnabled,
    retry(failureCount, error) {
      if (error instanceof RedirectingForAuthError) return false
      return failureCount < 3
    },
  })
  const isAuthPending = isAuthLoading || !isAuthenticated
  const showLoading = isAuthPending || q.isLoading || q.isFetching

  return {
    ...q,
    isAuthPending,
    showLoading,
    isEnabled,
  }
}

export function useApiMutation<Input extends Json, Output = unknown>(opts?: {
  scope?: string
  endpoint?: (variables: Input) => { path: string; method?: string }
  path?: string
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  invalidateKeys?: ReadonlyArray<Array<unknown>>
}) {
  const { request } = useApiClient()
  const qc = useQueryClient()

  return useMutation<Output, Error, Input>({
    mutationFn: async (variables) => {
      const { path, method = opts?.method ?? 'POST' } = opts?.endpoint?.(
        variables,
      ) ?? { path: opts?.path!, method: opts?.method ?? 'POST' }

      return await request<Output>(path, {
        method,
        body: JSON.stringify(variables),
        scope: opts?.scope,
      })
    },
    retry(failureCount, error) {
      if (error instanceof RedirectingForAuthError) return false
      return failureCount < 3
    },
    onSuccess: async () => {
      if (opts?.invalidateKeys) {
        await Promise.all(
          opts.invalidateKeys.map((k) => qc.invalidateQueries({ queryKey: k })),
        )
      }
    },
  })
}

// ======================================================
// 🔹 Simplified fetchers (clean + unified base URL)
// ======================================================
export async function fetchGrades(requestFn: (p: string) => Promise<any>) {
  return requestFn('/grades') as Promise<Array<Grade>>
}

export async function fetchGradesByUser(courseId: number, userId: number) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/grades/${courseId}/${userId}`
  )
  if (!res.ok) throw new Error('Failed to fetch grades')
  return res.json()
}


export async function fetchCourses(requestFn: (p: string) => Promise<any>) {
  return requestFn('/courses') as Promise<Array<Course>>
}

// ======================================================
// 🔹 Current user hook
// ======================================================
export type CurrentUser = {
  id: number
  firstName?: string | null
  lastName?: string | null
  email?: string | null
}

export function useCurrentUser(opts?: { scope?: string }) {
  return useApiQuery<CurrentUser>(['users', 'me'], '/users/me', {
    scope: opts?.scope,
  })
}

// ======================================================
// 🔹 Legacy compatibility (still works, but cleaned up)
// ======================================================
export async function backendFetcher<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`)
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`)
  return res.json()
}

export async function mutateBackend<T>(
  endpoint: string,
  method: string,
  body?: any,
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`Failed to mutate ${endpoint}`)
  return res.json()
}
