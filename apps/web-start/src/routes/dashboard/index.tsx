import { Link, createFileRoute } from '@tanstack/react-router'
import RequireAuth from '../../components/RequireAuth'
import LogoutButton from '../../components/LogoutButton' // ✅ Import it here
import styles from './index.module.css'

function RouteComponent() {
  return (
    <>
      <h1>Dashboard</h1>

      <div className={styles.sidenav}>
        <Link to="/dashboard" className={styles.link}>
          Dashboard
        </Link>
        <Link to="." className={styles.link}>
          Courses
        </Link>
        <Link to="/calendar" className={styles.link}>
          Calendar
        </Link>

        {/* ✅ Logout placed at bottom of nav */}
        <div style={{ marginTop: "auto", padding: "1rem" }}>
          <LogoutButton />
        </div>
      </div>

      <div className={styles.flexContainer}>
        <div>CISC108</div>
        <div>CISC106</div>
        <div>CISC210</div>
      </div>

      <div className={styles.flexContainer}>
        <div><Link to="/course">CISC474</Link></div>
        <div>CISC483</div>
        <div>CISC437</div>
      </div>
    </>
  )
}

export const Route = createFileRoute('/dashboard/')({
  ssr: false,
  component: () => (
    <RequireAuth>
      <RouteComponent />
    </RequireAuth>
  ),
})
