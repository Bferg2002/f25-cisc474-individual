import { Link, createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import RequireAuth from '../../components/RequireAuth'
import LogoutButton from '../../components/LogoutButton'
import styles from './index.module.css'
import type { AssignmentOut } from "@repo/api"

export const Route = createFileRoute('/course/')({
  ssr: false,
  component: () => (
    <RequireAuth>
      <CoursePage />
    </RequireAuth>
  ),
})

function AssignmentsList() {
  const { getAccessTokenSilently } = useAuth0()

  const { data, isLoading, error } = useQuery<Array<AssignmentOut>>({
    queryKey: ['assignments'],
    queryFn: async () => {
  const token = await getAccessTokenSilently({
    authorizationParams: {
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      scope: "read:assignments read:courses read:grades"
    },
  })

  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/assignments`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )

  if (!res.ok) {
    console.error("❌ Assignments fetch failed:", res.status)
    throw new Error(`Failed to load assignments: ${res.status}`)
  }

  return res.json()
},

  })

  if (isLoading) return <p>Loading assignments...</p>
  if (error)
    return <p style={{ color: 'red' }}>Error loading assignments</p>

  const overdueAssignments = data?.slice(0, 1) ?? []
  const upcomingAssignments = data?.slice(1, 2) ?? []
  const pastAssignments = data?.slice(2) ?? []

  return (
    <>
      <p className={styles.assignmentHeader}>Overdue Assignments</p>
      <div className={styles.flexContainer}>
        {overdueAssignments.map((a) => (
          <div key={a.id}>{a.name}</div>
        ))}
      </div>

      <p className={styles.assignmentHeader}>Upcoming Assignments</p>
      <div className={styles.flexContainer}>
        {upcomingAssignments.map((a) => (
          <div key={a.id}>{a.name}</div>
        ))}
      </div>

      <p className={styles.assignmentHeader}>Past Assignments</p>
      <div className={styles.flexContainer}>
        {pastAssignments.map((a) => (
          <div key={a.id}>{a.name}</div>
        ))}
      </div>
    </>
  )
}

function CoursePage() {
  return (
    <div className={styles.pageContainer}>
      {/* ✅ Main Canvas Navigation */}
      <div className={styles.sidenav}>
        <Link to="/dashboard" className={styles.link}>Dashboard</Link>
        <Link to="/course" className={styles.link}>Courses</Link>
        <Link to="/calendar" className={styles.link}>Calendar</Link>
        <LogoutButton />
      </div>

      <div className={styles.contentWrapper}>
        <h1 className={styles.heading}>CISC474</h1>

        {/* ✅ Course Sub Navigation */}
        <div className={styles.courseSidenav}>
          <Link to="/course" className={styles.link}>Home</Link>
          <Link to="/course" className={styles.link}>Syllabus</Link>
          <Link to="/course" className={styles.link}>Assignments</Link>
          <Link to="/course/grades" className={styles.link}>Grades</Link>
        </div>

        {/* ✅ Assignments Content */}
        <Suspense fallback={<div>Loading...</div>}>
          <AssignmentsList />
        </Suspense>
      </div>
    </div>
  )
}
