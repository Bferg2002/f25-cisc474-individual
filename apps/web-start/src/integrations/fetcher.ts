export type Course = {
  id: number;
  name: string;
};

export type Grade = {
  userId: number;
  assignmentId: number;
  late: boolean;
  published: boolean;
  grade: string;
  score: number;
  assignment: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
};

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function backendFetcher<T>(endpoint: string): Promise<T> {
  const res = await fetch(import.meta.env.VITE_BACKEND_URL + endpoint);
  if (!res.ok) throw new Error('Failed to fetch ' + endpoint);
  return res.json();
}

export async function fetchCourses(): Promise<Array<Course>> {
  const res = await fetch(`${BASE_URL}/courses`);
  return res.json();
}

export async function fetchGrades(): Promise<Array<Grade>> {
  const res = await fetch(`${BASE_URL}/grades`);
  return res.json();
}
