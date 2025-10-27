import { useAuth0 } from '@auth0/auth0-react'
import type { GradeOut } from '@repo/api/grades'

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

const BASE_URL = import.meta.env.VITE_BACKEND_URL

// ✅ Core fetcher without authentication
export async function backendFetcher<T>(endpoint: string, token?: string): Promise<T> {
  const headers: Record<string, string> = {}
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, { headers })

  if (!res.ok) {
    throw new Error('Failed to fetch ' + endpoint)
  }

  return res.json()
}

// ✅ Existing functions now work in both unauth + auth mode
export async function fetchGrades(token?: string): Promise<Array<Grade>> {
  return backendFetcher<Array<Grade>>('/grades', token)
}

export async function fetchGradesByUser(userId: number, token?: string): Promise<Array<GradeOut>> {
  return backendFetcher<Array<GradeOut>>(`/grades/user/${userId}`, token)
}

export async function fetchCourses(token?: string): Promise<Array<Course>> {
  return backendFetcher<Array<Course>>('/courses', token)
}

export async function mutateBackend<T>(
  endpoint: string,
  method: string,
  body?: any,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    throw new Error('Failed to mutate ' + endpoint)
  }

  return res.json()
}

// ✅ Auth wrapper hook that adds token automatically
export const useBackendApi = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  const apiFetcher = async <T>(fn: (token?: string) => Promise<T>) => {
    if (isAuthenticated) {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      })
      return fn(token)
    }
    throw new Error('User is not authenticated')
  }

  return {
    fetchCourses: () => apiFetcher(fetchCourses),
    fetchGrades: () => apiFetcher(fetchGrades),
    fetchGradesByUser: (id: number) => apiFetcher((token) => fetchGradesByUser(id, token)),
    mutateBackend: (endpoint: string, method: string, body?: any) =>
      apiFetcher((token) => mutateBackend(endpoint, method, body, token)),
  }
}
