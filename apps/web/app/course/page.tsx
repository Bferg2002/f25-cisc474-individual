import Link from "next/link";
import styles from "./page.module.css";

export default function CoursePage() {
  return (
    <div className="p-6">
      <h1 className ={styles.heading}>CISC474</h1>
      <h1 className="text-2xl font-bold mb-4">Course</h1>

      {/* Main Canvas Sidebar - Left */}
      <div className={styles.mainSidenav}>
        <Link href="/dashboard" className={styles.link}>
          Dashboard
        </Link>
        <Link href="/courses" className={styles.link}>
          Courses
        </Link>
        <Link href="/calendar" className={styles.link}>
          Calendar
        </Link>
      </div>

      {/* Course Navigation Sidebar - Second from left */}
      <div className={styles.courseSidenav}>
        <Link href="/course" className={styles.link}>
          Home
        </Link>
        <Link href="/course/syllabus" className={styles.link}>
          Syllabus
        </Link>
        <Link href="/course/assignments" className={styles.link}>
          Assignments
        </Link>
        <Link href="/course/grades" className={styles.link}>
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
  );
}
