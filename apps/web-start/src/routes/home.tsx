import { Link, createFileRoute } from '@tanstack/react-router';
import { useAuth0 } from '@auth0/auth0-react';

export const Route = createFileRoute('/home')({
  component: RouteComponent,
  ssr: false, // 👈 avoids SSR hydration mismatch
});



function RouteComponent() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div style={{ padding: '2rem' }}>
        <h2>User Information</h2>
        <pre>{JSON.stringify(user, null, 2)}</pre>

        <Link to="/dashboard">View Courses</Link>
      </div>
    )
  );
}
