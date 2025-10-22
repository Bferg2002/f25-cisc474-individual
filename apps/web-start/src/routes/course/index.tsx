import { Link, createFileRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { backendFetcher } from '../../integrations/fetcher';
import styles from './index.module.css';

export const Route = createFileRoute('/course/')({
  component: RouteComponent,
});

type Assignment = {
  id: number;
  courseId: number;
  name: string;
};

// Create a QueryClient at app level (or here for simplicity)
const queryClient = new QueryClient();

function AssignmentsList() {
  const { data } = useQuery<Array<Assignment>>({
    queryKey: ['assignments'],
    queryFn: () => backendFetcher<Array<Assignment>>('/assignments'),
  });

  const assignments = data ?? [];

  const overdueAssignments = assignments.slice(0, 1);
  const upcomingAssignments = assignments.slice(1, 2);
  const pastAssignments = assignments.slice(2);

  return (
    <>
      <p className={styles.assignmentHeader}>Overdue Assignments</p>
      <div className={styles.flexContainer}>
        {overdueAssignments.map((assignment) => (
          <div key={assignment.id}>{assignment.name}</div>
        ))}
      </div>

      <p className={styles.assignmentHeader}>Upcoming Assignments</p>
      <div className={styles.flexContainer}>
        {upcomingAssignments.map((assignment) => (
          <div key={assignment.id}>{assignment.name}</div>
        ))}
      </div>

      <p className={styles.assignmentHeader}>Past Assignments</p>
      <div className={styles.flexContainer}>
        {pastAssignments.map((assignment) => (
          <div key={assignment.id}>{assignment.name}</div>
        ))}
      </div>
    </>
  );
}

function RouteComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-6">
        <h1 className={styles.heading}>CISC474</h1>
        <h1 className="text-2xl font-bold mb-4">Course</h1>

        {/* Main Canvas Sidebar - Left */}
        <div className={styles.mainSidenav}>
          <Link to="/dashboard" className={styles.link}>Dashboard</Link>
          <Link to="." className={styles.link}>Courses</Link>
          <Link to="/calendar" className={styles.link}>Calendar</Link>
        </div>

        {/* Course Navigation Sidebar - Second from left */}
        <div className={styles.courseSidenav}>
          <Link to="." className={styles.link}>Home</Link>
          <Link to="." className={styles.link}>Syllabus</Link>
          <Link to="." className={styles.link}>Assignments</Link>
          <Link to="/course/grades" className={styles.link}>Grades</Link>
        </div>

        {/* Assignments List wrapped in Suspense */}
        <Suspense fallback={<div>Loading assignments...</div>}>
          <AssignmentsList />
        </Suspense>
      </div>
    </QueryClientProvider>
  );
}
