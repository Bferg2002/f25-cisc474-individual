import { useAuth0 } from "@auth0/auth0-react"
import type { GradeOut } from "@repo/api/grades"
import type { AssignmentOut } from "@repo/api"

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

export const BASE_URL = import.meta.env.VITE_BACKEND_URL

// ✅ DRY secured fetch wrapper with better error debugging
export async function secureFetch<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    console.error(`❌ Backend error (${endpoint}):`, res.status, res.statusText)
    const errText = await res.text().catch(() => "")
    console.error("Server response:", errText)
    throw new Error(`Fetch failed: ${res.status} ${endpoint}`)
  }

  return res.json()
}

// ✅ API functions
export async function fetchCourses(token: string): Promise<Array<Course>> {
  return secureFetch<Array<Course>>("/courses", token)
}

export async function fetchGrades(token: string): Promise<Array<Grade>> {
  return secureFetch<Array<Grade>>("/grades", token)
}

export async function fetchGradesByUser(
  userId: number,
  token: string
): Promise<Array<GradeOut>> {
  return secureFetch<Array<GradeOut>>(`/grades/user/${userId}`, token)
}

// ✅ NEW: assignments fetch
export async function fetchAssignments(
  token: string
): Promise<Array<AssignmentOut>> {
  return secureFetch<Array<AssignmentOut>>("/assignments", token)
}

export async function mutateBackend<T>(
  endpoint: string,
  method: string,
  body: any,
  token: string
): Promise<T> {
  return secureFetch<T>(endpoint, token, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
}

// ✅ Hook — always includes audience + proper scopes ✅
export function useBackendApi() {
  const { getAccessTokenSilently } = useAuth0()

  const withToken = async <T>(fn: (token: string) => Promise<T>) => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: "read:assignments read:courses read:grades",
      },
    })
    return fn(token)
  }

  return {
    fetchCourses: () => withToken(fetchCourses),
    fetchGrades: () => withToken(fetchGrades),
    fetchAssignments: () => withToken(fetchAssignments),
    fetchGradesByUser: (id: number) =>
      withToken((t) => fetchGradesByUser(id, t)),
    mutateBackend: (endpoint: string, method: string, body?: any) =>
      withToken((t) => mutateBackend(endpoint, method, body, t)),
  }
}
