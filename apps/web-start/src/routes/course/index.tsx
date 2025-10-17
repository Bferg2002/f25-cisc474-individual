import { Link, createFileRoute } from '@tanstack/react-router'
import styles from './index.module.css'

export const Route = createFileRoute('/course/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-6">
      <h1 className={styles.heading}>CISC474</h1>
      <h1 className="text-2xl font-bold mb-4">Course</h1>

      {/* Main Canvas Sidebar - Left */}
      <div className={styles.mainSidenav}>
        <Link to="/dashboard" className={styles.link}>
          Dashboard
        </Link>
        <Link to="." className={styles.link}>
          Courses
        </Link>
        <Link to="/calendar" className={styles.link}>
          Calendar
        </Link>
      </div>

      {/* Course Navigation Sidebar - Second from left */}
      <div className={styles.courseSidenav}>
        <Link to="." className={styles.link}>
          Home
        </Link>
        <Link to="." className={styles.link}>
          Syllabus
        </Link>
        <Link to="." className={styles.link}>
          Assignments
        </Link>
        <Link to="/course/grades" className={styles.link}>
          Grades
        </Link>
      </div>

      <p className={styles.assignmentHeader}>Overdue Assignments</p>
      <div className={styles.flexContainer}>
        <div>Assignment</div>
      </div>

      <p className={styles.assignmentHeader}>Upcoming Assignments</p>
      <div className={styles.flexContainer}>
        <div>Assignment</div>
      </div>

      <p className={styles.assignmentHeader}>Past Assignments</p>
      <div className={styles.flexContainer}>
        <div>Assignment</div>
      </div>
    </div>
  )
}
