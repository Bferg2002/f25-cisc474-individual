import Link from "next/link";
import styles from "./page.module.css";

export default function GradesPage() {
  return (
    <div className="p-6">
      <h1 className={styles.heading}>Grades for Bryant Ferguson</h1>
      
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

      <div className={styles.gradesContainer}>
        <div className={styles.controlsRow}>
          <div className={styles.courseDropdown}>
            <label>Course</label>
            <select className={styles.dropdown}>
              <option>CISC474</option>
            </select>
          </div>
          
          <div className={styles.arrangeDropdown}>
            <label>Arrange By</label>
            <select className={styles.dropdown}>
              <option>Due Date</option>
            </select>
          </div>
          
          <button className={styles.applyButton}>Apply</button>
        </div>

        <div className={styles.gradesTable}>
          <div className={styles.tableHeader}>
            <div className={styles.headerCell}>Name</div>
            <div className={styles.headerCell}>Due</div>
            <div className={styles.headerCell}>Score</div>
          </div>
          
          <div className={styles.tableRow}>
            <div className={styles.tableCell}>Assignment 1</div>
            <div className={styles.tableCell}>9/10/25</div>
            <div className={styles.tableCell}>85/100</div>
          </div>
        </div>
      </div>
    </div>
  );
}