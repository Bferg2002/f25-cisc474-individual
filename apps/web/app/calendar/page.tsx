import Link from "next/link";
import styles from "./page.module.css";

export default function CalendarPage() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.heading}>Assignment Calendar</h1>

      <div className={styles.sidenav}>
        <Link href="/dashboard" className={styles.link}>
          Dashboard
        </Link>
        <Link href="/course/syllabus" className={styles.link}>
          Courses
        </Link>
        <Link href="/calendar" className={styles.link}>
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
