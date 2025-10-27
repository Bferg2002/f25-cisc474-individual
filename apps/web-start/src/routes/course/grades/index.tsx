import { Link, createFileRoute } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchGradesByUser, mutateBackend } from '../../../integrations/fetcher';
import styles from './index.module.css';
import type { GradeCreateIn, GradeOut, GradeUpdateIn } from '@repo/api/grades';


// ✅ Fixed route path
export const Route = createFileRoute('/course/grades/')({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const currentUserId = 2; // placeholder for logged-in user

  const { data: grades, isLoading, error } = useQuery<Array<GradeOut>>({
    queryKey: ['grades', currentUserId],
    queryFn: () => fetchGradesByUser(currentUserId),
  });

  const [selectedGrade, setSelectedGrade] = useState<GradeOut | null>(null);

  // CREATE
  const createMutation = useMutation({
    mutationFn: (newGrade: GradeCreateIn) =>
      mutateBackend<GradeOut>('/grades', 'POST', newGrade),
    onSuccess: (createdGrade: GradeOut) => {
      queryClient.setQueryData<Array<GradeOut>>(['grades', currentUserId], (old) => [
        ...(old ?? []),
        createdGrade,
      ]);
    },
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: (
      updated: GradeUpdateIn & { userId: number; assignmentId: number },
    ) =>
      mutateBackend<GradeOut>(
        `/grades/${updated.userId}/${updated.assignmentId}`,
        'PATCH',
        updated,
      ),
    onSuccess: (updatedGrade: GradeOut) => {
      queryClient.setQueryData<Array<GradeOut>>(['grades', currentUserId], (old) =>
        (old ?? []).map((g) =>
          g.userId === updatedGrade.userId && g.assignmentId === updatedGrade.assignmentId
            ? updatedGrade
            : g,
        ),
      );
      setSelectedGrade(null);
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: (target: { userId: number; assignmentId: number }) =>
      mutateBackend<GradeOut>(
        `/grades/${target.userId}/${target.assignmentId}`,
        'DELETE',
      ),
    onSuccess: (_, vars) => {
      queryClient.setQueryData<Array<GradeOut>>(['grades', currentUserId], (old) =>
        (old ?? []).filter(
          (g) => !(g.userId === vars.userId && g.assignmentId === vars.assignmentId),
        ),
      );
    },
  });

  if (isLoading) return <div>Loading grades...</div>;
  if (error) return <div>Something went wrong! {String(error)}</div>;

  return (
    <div className="p-6">
      <h1 className={styles.heading}>Grades for Bryant Ferguson</h1>

      {/* SIDEBARS */}
      <div className={styles.mainSidenav}>
        <Link to="/dashboard" className={styles.link}>Dashboard</Link>
        <Link to="/course" className={styles.link}>Courses</Link>
        <Link to="/calendar" className={styles.link}>Calendar</Link>
      </div>

      <div className={styles.courseSidenav}>
        <Link to="/course" className={styles.link}>Home</Link>
        <span className={styles.linkDisabled}>Syllabus</span>
        <span className={styles.linkDisabled}>Assignments</span>
        {/* ✅ Link fixed */}
      <Link to="/course/grades" className={styles.link}>Grades</Link>
      </div>

      {/* TABLE */}
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
        </div>

        <GradesTable
          grades={grades ?? []}
          onEdit={(grade) => setSelectedGrade(grade)}
          onDelete={(grade) =>
            deleteMutation.mutate({
              userId: grade.userId,
              assignmentId: grade.assignmentId,
            })
          }
        />

        {/* FORMS */}
        <div
          className={styles.controlsRow}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '3rem',
            marginTop: '2rem',
          }}
        >
          <div
            style={{
              background: '#fafafa',
              padding: '1rem 1.5rem',
              borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              minWidth: '320px',
            }}
          >
            <CreateGradeForm createMutation={createMutation} currentUserId={currentUserId} />
          </div>

          <div
            style={{
              background: '#fafafa',
              padding: '1rem 1.5rem',
              borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              minWidth: '320px',
            }}
          >
            <UpdateGradeForm
              selectedGrade={selectedGrade}
              updateMutation={updateMutation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// TYPES
interface GradesTableProps {
  grades: Array<GradeOut>;
  onEdit: (grade: GradeOut) => void;
  onDelete: (grade: GradeOut) => void;
}
interface CreateGradeFormProps {
  createMutation: ReturnType<typeof useMutation<GradeOut, unknown, GradeCreateIn>>;
  currentUserId: number;
}
interface UpdateGradeFormProps {
  selectedGrade: GradeOut | null;
  updateMutation: ReturnType<
    typeof useMutation<GradeOut, unknown, GradeUpdateIn & { userId: number; assignmentId: number }>
  >;
}

// TABLE
function GradesTable({ grades, onEdit, onDelete }: GradesTableProps) {
  return (
    <div className={styles.gradesTable}>
      <div className={styles.tableHeader}>
        <div className={styles.headerCell}>Assignment Name</div>
        <div className={styles.headerCell}>Score</div>
        <div className={styles.headerCell}>Letter Grade</div>
        <div className={styles.headerCell}>Published</div>
        <div className={styles.headerCell}>Late?</div>
        <div className={styles.headerCell}>Actions</div>
      </div>

      {grades.map((grade: GradeOut) => (
        <div key={`${grade.assignmentId}-${grade.userId}`} className={styles.tableRow}>
          <div className={styles.tableCell}>{grade.assignment.name}</div>
          <div className={styles.tableCell}>{grade.score}</div>
          <div className={styles.tableCell}>
            {grade.grade ? grade.grade : <span style={{ color: '#999' }}>—</span>}
          </div>
          <div className={styles.tableCell}>{grade.published ? 'Yes' : 'No'}</div>
          <div
            className={styles.tableCell}
            style={{ color: grade.late ? 'red' : 'green', fontWeight: 500 }}
          >
            {grade.late ? 'Late' : 'On Time'}
          </div>
          <div className={styles.tableCell}>
            <button onClick={() => onEdit(grade)} style={{ marginRight: '0.5rem' }}>
              ✏️ Edit
            </button>
            <button onClick={() => onDelete(grade)}>❌ Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// CREATE FORM
function CreateGradeForm({ createMutation, currentUserId }: CreateGradeFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = new FormData(form);
        createMutation.mutate({
          userId: currentUserId,
          assignmentId: Number(data.get('assignmentId')),
          grade: String(data.get('grade')),
          score: Number(data.get('score')),
          late: data.get('late') === 'true',
          published: data.get('published') === 'true',
        });
        form.reset();
        setTimeout(() => createMutation.reset(), 1500);
      }}
    >
      <h3>Create Grade</h3>
      <label>Assignment</label>
      <select name="assignmentId" required>
        <option value="1">Homework 1</option>
        <option value="2">Project 1</option>
        <option value="3">Homework 2</option>
      </select>

      <input name="grade" placeholder="Letter Grade (A, B, C...)" required />
      <input name="score" placeholder="Score" required type="number" />

      <select name="late" required>
        <option value="false">On time</option>
        <option value="true">Late</option>
      </select>

      <select name="published" required>
        <option value="true">Published</option>
        <option value="false">Not Published</option>
      </select>

      <button type="submit" disabled={createMutation.isPending}>
        ➕ Create
      </button>

      {createMutation.isSuccess && <div style={{ color: 'green' }}>✅ Created!</div>}
      {createMutation.isError && (
        <div style={{ color: 'red' }}>
          Error:{' '}
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : String(createMutation.error)}
        </div>
      )}
    </form>
  );
}

// UPDATE FORM
function UpdateGradeForm({ selectedGrade, updateMutation }: UpdateGradeFormProps) {
  if (!selectedGrade) {
    return <div>Click ✏️ Edit to populate the update form.</div>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = new FormData(form);
        updateMutation.mutate({
          userId: selectedGrade.userId,
          assignmentId: selectedGrade.assignmentId,
          grade: String(data.get('grade') || selectedGrade.grade),
          score: Number(data.get('score') || selectedGrade.score),
          late:
            data.get('late') === ''
              ? selectedGrade.late
              : data.get('late') === 'true',
          published:
            data.get('published') === ''
              ? selectedGrade.published
              : data.get('published') === 'true',
        });
        form.reset();
        setTimeout(() => updateMutation.reset(), 1500);
      }}
    >
      <h3>Update Grade</h3>
      <div style={{ marginBottom: '4px' }}>
        Editing: <strong>{selectedGrade.assignment.name}</strong> (assignmentId:{' '}
        {selectedGrade.assignmentId})
      </div>
      <input name="grade" placeholder="New Grade" />
      <input name="score" placeholder="New Score" type="number" />
      <select name="late">
        <option value="">--Late?--</option>
        <option value="false">On time</option>
        <option value="true">Late</option>
      </select>
      <select name="published">
        <option value="">--Published?--</option>
        <option value="true">Published</option>
        <option value="false">Not Published</option>
      </select>
      <button type="submit" disabled={updateMutation.isPending}>✏️ Update</button>
      {updateMutation.isSuccess && <div style={{ color: 'green' }}>✅ Updated!</div>}
      {updateMutation.isError && (
        <div style={{ color: 'red' }}>
          Error:{' '}
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : String(updateMutation.error)}
        </div>
      )}
    </form>
  );
}
