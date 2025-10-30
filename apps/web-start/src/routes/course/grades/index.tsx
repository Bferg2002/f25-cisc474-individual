import { Link, createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useBackendApi } from '../../../integrations/fetcher'
import RequireAuth from '../../../components/RequireAuth'
import LogoutButton from '../../../components/LogoutButton'
import styles from './index.module.css'
import type { GradeCreateIn, GradeOut, GradeUpdateIn } from '@repo/api/grades'
import type { UseMutationResult } from '@tanstack/react-query'

function RouteComponent() {
  const queryClient = useQueryClient()
  const { fetchGradesByUser, mutateBackend } = useBackendApi()

  const currentUserId = 2 // ✅ later replaced w/ Auth0 user id

  const {
    data: grades,
    isLoading,
    error,
  } = useQuery<Array<GradeOut>>({
    queryKey: ['grades', currentUserId],
    queryFn: () => fetchGradesByUser(currentUserId),
  })

  const [selectedGrade, setSelectedGrade] = useState<GradeOut | null>(null)

  // ✅ CREATE (returns unknown → TS happy)
  const createMutation = useMutation<
    unknown,
    Error,
    GradeCreateIn
  >({
    mutationFn: (newGrade) =>
      mutateBackend('/grades', 'POST', newGrade),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['grades', currentUserId] }),
  })

  // ✅ UPDATE
  const updateMutation = useMutation<
    unknown,
    Error,
    GradeUpdateIn & { userId: number; assignmentId: number }
  >({
    mutationFn: (updated) =>
      mutateBackend(
        `/grades/${updated.userId}/${updated.assignmentId}`,
        'PATCH',
        updated
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades', currentUserId] })
      setSelectedGrade(null)
    },
  })

  // ✅ DELETE
  const deleteMutation = useMutation<
    unknown,
    Error,
    { userId: number; assignmentId: number }
  >({
    mutationFn: ({ userId, assignmentId }) =>
      mutateBackend(
        `/grades/${userId}/${assignmentId}`,
        'DELETE',
        {}
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['grades', currentUserId] }),
  })

  if (isLoading) return <div>Loading grades...</div>
  if (error) return <div>Something went wrong! {String(error)}</div>

  return (
    <div className="p-6">
      <h1 className={styles.heading}>Grades for Bryant Ferguson</h1>

      {/* Main Sidebar */}
      <div className={styles.mainSidenav}>
        <Link to="/dashboard" className={styles.link}>Dashboard</Link>
        <Link to="/course" className={styles.link}>Courses</Link>
        <Link to="/calendar" className={styles.link}>Calendar</Link>
      </div>

      {/* Course Sidebar */}
      <div className={styles.courseSidenav}>
        <Link to="/course" className={styles.link}>Home</Link>
        <span className={styles.linkDisabled}>Syllabus</span>
        <span className={styles.linkDisabled}>Assignments</span>
        <Link to="/course/grades" className={styles.link}>Grades</Link>
      </div>

      <div style={{ marginTop: "auto", padding: "1rem" }}>
        <LogoutButton />
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
        </div>

        <GradesTable
          grades={grades ?? []}
          onEdit={setSelectedGrade}
          onDelete={(grade) =>
            deleteMutation.mutate({
              userId: grade.userId,
              assignmentId: grade.assignmentId,
            })
          }
        />

        {/* Forms */}
        <div className={styles.controlsRow} style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '2rem' }}>
          <FormCard>
            <CreateGradeForm createMutation={createMutation} currentUserId={currentUserId} />
          </FormCard>

          <FormCard>
            <UpdateGradeForm selectedGrade={selectedGrade} updateMutation={updateMutation} />
          </FormCard>
        </div>
      </div>
    </div>
  )
}

// ✅ Shared card UI
function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#fafafa', padding: '1rem 1.5rem', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', minWidth: '320px' }}>
      {children}
    </div>
  )
}

function GradesTable({ grades, onEdit, onDelete }: { grades: GradeOut[], onEdit: (g: GradeOut)=>void, onDelete: (g: GradeOut)=>void }) {
  return (
    <div className={styles.gradesTable}>
      <div className={styles.tableHeader}>
        <div className={styles.headerCell}>Assignment</div>
        <div className={styles.headerCell}>Score</div>
        <div className={styles.headerCell}>Letter</div>
        <div className={styles.headerCell}>Published</div>
        <div className={styles.headerCell}>Late?</div>
        <div className={styles.headerCell}>Actions</div>
      </div>

      {grades.map((g) => (
        <div key={`${g.assignmentId}-${g.userId}`} className={styles.tableRow}>
          <div className={styles.tableCell}>{g.assignment.name}</div>
          <div className={styles.tableCell}>{g.score}</div>
          <div className={styles.tableCell}>{g.grade ?? "—"}</div>
          <div className={styles.tableCell}>{g.published ? "Yes" : "No"}</div>
          <div className={styles.tableCell} style={{ color: g.late ? 'red' : 'green' }}>
            {g.late ? "Late" : "On Time"}
          </div>
          <div className={styles.tableCell}>
            <button onClick={() => onEdit(g)} style={{ marginRight: '0.5rem' }}>✏️</button>
            <button onClick={() => onDelete(g)}>❌</button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ✅ CREATE FORM
function CreateGradeForm({
  createMutation,
  currentUserId,
}: {
  createMutation: UseMutationResult<unknown, unknown, any, unknown>
  currentUserId: number
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const data = new FormData(form)

        createMutation.mutate({
          userId: currentUserId,
          assignmentId: Number(data.get('assignmentId')),
          grade: String(data.get('grade')),
          score: Number(data.get('score')),
          late: data.get('late') === 'true',
          published: data.get('published') === 'true',
        })

        form.reset()
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
      <input name="score" type="number" placeholder="Score" required />

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
          ❌ Error:{' '}
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : String(createMutation.error)}
        </div>
      )}
    </form>
  )
}

// ✅ UPDATE FORM
function UpdateGradeForm({
  selectedGrade,
  updateMutation,
}: {
  selectedGrade: GradeOut | null
  updateMutation: UseMutationResult<unknown, unknown, any, unknown>
}) {
  if (!selectedGrade) {
    return <div>Click ✏️ Edit to populate the update form.</div>
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const data = new FormData(form)

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
        })

        form.reset()
      }}
    >
      <h3>Update Grade</h3>
      <div style={{ marginBottom: '4px' }}>
        Editing: <strong>{selectedGrade.assignment.name}</strong> (assignmentId:{' '}
        {selectedGrade.assignmentId})
      </div>

      <input name="grade" placeholder="New Grade" />
      <input name="score" type="number" placeholder="New Score" />

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
          ❌ Error:{' '}
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : String(updateMutation.error)}
        </div>
      )}
    </form>
  )
}
export const Route = createFileRoute('/course/grades/')({
  component: () => (
    <RequireAuth>
      <RouteComponent />
    </RequireAuth>
  ),
})
