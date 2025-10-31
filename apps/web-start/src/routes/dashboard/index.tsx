import { Link, createFileRoute } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'
import LogoutButton from '../../components/LogoutButton'
import styles from './index.module.css'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
  ssr: false, // prevent hydration mismatch when reading Auth0 state
})

function RouteComponent() {
  const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0()

  // Wait for Auth0 to finish loading
  if (isLoading) {
    return <div>Loading authentication...</div>
  }

  // If not authenticated, redirect to Auth0 login
  if (!isAuthenticated) {
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin + '/home',
      },
    })
    return null // Prevent flicker
  }

  // ✅ Authenticated: show dashboard content
  return (
    <>
        <h1 className={styles.userName}>Welcome, {user?.name || 'User'}!</h1>

      <div className={styles.sidenav}>
        <Link to="/dashboard" className={styles.link}>
          Dashboard
        </Link>
        <Link to="/courses" className={styles.link}>
          Courses
        </Link>
        <Link to="/calendar" className={styles.link}>
          Calendar
        </Link>

        {/* 🔹 Logout button added here */}
        <LogoutButton />
      </div>

      <div className={styles.flexContainer}>
        <div>CISC108</div>
        <div>CISC106</div>
        <div>CISC210</div>
      </div>

      <div className={styles.flexContainer}>
        <div>
          <Link to="/course">CISC474</Link>
        </div>
        <div>CISC483</div>
        <div>CISC437</div>
      </div>
    </>
  )
}
