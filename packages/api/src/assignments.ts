// packages/api/src/assignments/assignments.ts
import { z } from "zod";

/**
 * ──────────────────────────────
 *  OUTPUT DTO (Backend → Frontend)
 * ──────────────────────────────
 */
export const AssignmentOut = z.object({
  id: z.number(),
  courseId: z.number(),
  name: z.string(),
});
export type AssignmentOut = z.infer<typeof AssignmentOut>;

/**
 * ──────────────────────────────
 *  INPUT DTOs (Frontend → Backend)
 * ──────────────────────────────
 */
export const AssignmentCreateIn = z.object({
  courseId: z.number(),
  name: z.string(),
});
export type AssignmentCreateIn = z.infer<typeof AssignmentCreateIn>;

export const AssignmentUpdateIn = z.object({
  name: z.string().optional(),
  courseId: z.number().optional(),
});
export type AssignmentUpdateIn = z.infer<typeof AssignmentUpdateIn>;

export const AssignmentRef = z.object({
  id: z.number(),
});
export type AssignmentRef = z.infer<typeof AssignmentRef>;
