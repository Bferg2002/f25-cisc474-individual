// packages/api/src/grades.ts
import { z } from "zod";

/**
 * ──────────────────────────────
 *  OUTPUT DTO (Backend → Frontend)
 * ──────────────────────────────
 */
export const GradeOut = z.object({
  userId: z.number(),
  assignmentId: z.number(),
  score: z.number(),
  grade: z.string(),
  published: z.boolean(),
  late: z.boolean(),
  assignment: z.object({
    id: z.number(),
    name: z.string(),
  }),
  user: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
  }),
});
export type GradeOut = z.infer<typeof GradeOut>;

/**
 * ──────────────────────────────
 *  INPUT DTOs (Frontend → Backend)
 * ──────────────────────────────
 */
export const GradeCreateIn = z.object({
  userId: z.number(),
  assignmentId: z.number(),
  score: z.number(),
  grade: z.string(),
  published: z.boolean().default(false),
  late: z.boolean().default(false),
});
export type GradeCreateIn = z.infer<typeof GradeCreateIn>;

export const GradeUpdateIn = z.object({
  score: z.number().optional(),
  grade: z.string().optional(),
  published: z.boolean().optional(),
  late: z.boolean().optional(),
});
export type GradeUpdateIn = z.infer<typeof GradeUpdateIn>;

/**
 * ──────────────────────────────
 *  REFERENCE DTO (for deletes or lookups)
 * ──────────────────────────────
 */
export const GradeRef = z.object({
  userId: z.number(),
  assignmentId: z.number(),
});
export type GradeRef = z.infer<typeof GradeRef>;
