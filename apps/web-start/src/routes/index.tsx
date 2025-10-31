import { Link, createFileRoute } from '@tanstack/react-router';
import LoginButton from '../components/LoginButton';
import styles from './index.module.css';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      <h1 className={styles.heading}>Welcome to Canvas!</h1>
      <p className={styles.subtext}>Please sign in to access your courses.</p>

      <LoginButton />

      <hr className="my-6 w-1/2 border-gray-400" />

      <Link to="/home" className={styles.link}>
        Go to Home (after login)
      </Link>
    </section>
  );
}
