import { PrismaClient } from '../generated/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Utility function to read JSON files and parse to the given type
function loadJson<T>(filename: string): T {
  const filePath = path.join(__dirname, 'data', filename);
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContents) as T;
}

async function main() {
  // Load JSON data with correct shapes
  const users = loadJson<Array<{
    firstName: string;
    lastName: string;
    email: string;
    isInstructor?: boolean;
    isAdmin?: boolean;
  }>>('users.json');

  const courses = loadJson<Array<{
    name: string;
  }>>('courses.json');

  const assignments = loadJson<Array<{
    id: number;
    courseId: number;
    name: string;
  }>>('assignments.json');

  const enrollments = loadJson<Array<{
    userId: number;
    courseId: number;
    finalGrade: string; // required
  }>>('enrollments.json');

  const grades = loadJson<Array<{
    userId: number;
    assignmentId: number;
    grade: string;
    score: number;
    late: boolean;       // required
    published: boolean;  // required
  }>>('grades.json');

await prisma.user.createMany({ data: users, skipDuplicates: true });
await prisma.course.createMany({ data: courses, skipDuplicates: true });
await prisma.assignment.createMany({ data: assignments, skipDuplicates: true });
await prisma.enrollment.createMany({ data: enrollments, skipDuplicates: true });
await prisma.grades.createMany({ data: grades, skipDuplicates: true });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
