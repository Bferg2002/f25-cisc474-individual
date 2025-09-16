import styles from "./page.module.css"; //import CSS module
import Link from "next/link";

export default function DashboardPage() {
  return (
    <>
 <h1>Dashboard</h1>
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
<div className={styles.flexContainer}>
  <div>CISC108</div>
  <div>CISC106</div>
  <div>CISC210</div>  
</div>

<div className={styles.flexContainer}>
  <div> <Link href="/course">CISC474</Link></div>
  <div>CISC483</div>
  <div>CISC437</div>  
</div>
</>  );
}
