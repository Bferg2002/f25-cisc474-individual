import { Link, createFileRoute } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'

export const Route = createFileRoute('/home/')({
  ssr: false,
  component: HomePage,
})

function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth0()

  if (isLoading) return <p>Loading...</p>

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome Home!</h1>

      {isAuthenticated && (
        <>
          <p>Logged in as: {user?.email}</p>

          {/* ✅ Navigation Links */}
          <nav style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/calendar">Calendar</Link>
            <Link to=".">Courses</Link>
          </nav>

          {/* ✅ Show full user JSON if you want */}
          <pre style={{ marginTop: '20px', fontSize: '12px' }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </>
      )}
    </div>
  )
}

