import { Link, createFileRoute } from '@tanstack/react-router'
import styles from './index.module.css'

export const Route = createFileRoute('/calendar/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.heading}>Assignment Calendar</h1>

      <div className={styles.sidenav}>
        <Link to="/dashboard" className={styles.link}>
          Dashboard
        </Link>
        <Link to="." className={styles.link}>
          Courses
        </Link>
        <Link to="." className={styles.link}>
          Calendar
        </Link>
      </div>
      
      <div className={styles.calendarContainer}>
        <div className={styles.calendarHeader}>
          <div>Sunday</div>
          <div>Monday</div>
          <div>Tuesday</div>
          <div>Wednesday</div>
          <div>Thursday</div>
          <div>Friday</div>
          <div>Saturday</div>
        </div>

        <div className={styles.calendarGrid}>
          {/* Empty days before first of the week */}
          <div></div><div></div><div></div><div></div><div></div>

          {/* Tuesday (CISC474 due) */}
          <div className={styles.dueDate}>
            1<br />
            CISC474 Assignment
          </div>

          {/* Wednesday */}
          <div></div>

          {/* Friday (CISC181 due) */}
          <div className={styles.dueDate}>
            3<br />
            CISC181 Assignment
          </div>

          {/* Fill remaining cells for simplicity */}
          <div></div><div></div>
        </div>
      </div>
    </div>
  );
}
