import { Link, createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchGrades } from '../../../integrations/fetcher';
import styles from './index.module.css';
import type { Grade } from '../../../integrations/fetcher';

export const Route = createFileRoute('/course/grades/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: grades, isLoading, error, refetch } = useQuery<Array<Grade>>({
    queryKey: ['grades'],
    queryFn: fetchGrades,
  });

  if (isLoading) return <div>Loading grades...</div>;
  if (error) return <div>Something went wrong! {String(error)}</div>;

  return (
    <div className="p-6">
      <h1 className={styles.heading}>Grades for Bryant Ferguson</h1>

      <div className={styles.mainSidenav}>
        <Link to="/dashboard" className={styles.link}>
          Dashboard
        </Link>
        <Link to="/course" className={styles.link}>
          Courses
        </Link>
        <Link to="/calendar" className={styles.link}>
          Calendar
        </Link>
      </div>

      <div className={styles.courseSidenav}>
        <Link to="/course" className={styles.link}>
          Home
        </Link>
        <span className={styles.linkDisabled}>Syllabus</span>
        <span className={styles.linkDisabled}>Assignments</span>
        <Link to="/course/grades" className={styles.link}>
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
              <option>Assignment</option>
              <option>Score</option>
            </select>
          </div>

          <button className={styles.applyButton} onClick={() => refetch()}>
            Apply
          </button>
        </div>

        <div className={styles.gradesTable}>
          <div className={styles.tableHeader}>
            <div className={styles.headerCell}>Assignment Name</div>
            <div className={styles.headerCell}>Score</div>
            <div className={styles.headerCell}>Published</div>
            <div className={styles.headerCell}>Late</div>
          </div>

          {grades?.map((grade) => (
            <div
              key={`${grade.assignmentId}-${grade.userId}`}
              className={styles.tableRow}
            >
              <div className={styles.tableCell}>{grade.assignment.name}</div>
              <div className={styles.tableCell}>{grade.score}</div>
              <div className={styles.tableCell}>{grade.published ? 'Yes' : 'No'}</div>
              <div className={styles.tableCell}>{grade.late ? 'Yes' : 'No'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}