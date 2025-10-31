import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  GradeOut,
  GradeCreateIn,
  GradeUpdateIn,
} from '@repo/api/grades';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  // ──────────────────────────────
  // READ — All Grades
  // ──────────────────────────────
  async findAll(): Promise<GradeOut[]> {
    try {
      const grades = await this.prisma.grades.findMany({
        include: { assignment: true, user: true },
      });
      return grades.map((g) => ({
        userId: g.userId,
        assignmentId: g.assignmentId,
        score: g.score,
        grade: g.grade,
        published: g.published,
        late: g.late,
        assignment: {
          id: g.assignment.id,
          name: g.assignment.name,
        },
        user: {
          id: g.user.id,
          firstName: g.user.firstName,
          lastName: g.user.lastName,
        },
      }));
    } catch (e) {
      console.error('GradesService.findAll error:', e);
      throw new InternalServerErrorException('Failed to fetch grades');
    }
  }

  // ──────────────────────────────
  // READ — One Grade
  // ──────────────────────────────
  async findOne(userId: number, assignmentId: number): Promise<GradeOut | null> {
    try {
      const g = await this.prisma.grades.findUnique({
        where: { assignmentId_userId: { userId, assignmentId } },
        include: { assignment: true, user: true },
      });
      if (!g) return null;
      return {
        userId: g.userId,
        assignmentId: g.assignmentId,
        score: g.score,
        grade: g.grade,
        published: g.published,
        late: g.late,
        assignment: { id: g.assignment.id, name: g.assignment.name },
        user: { id: g.user.id, firstName: g.user.firstName, lastName: g.user.lastName },
      };
    } catch (e) {
      console.error('GradesService.findOne error:', e);
      throw new InternalServerErrorException('Failed to fetch grade');
    }
  }

  // ──────────────────────────────
  // CREATE — New Grade
  // ──────────────────────────────
  async create(createGradeDto: GradeCreateIn): Promise<GradeOut> {
    try {
      const newGrade = await this.prisma.grades.create({
        data: createGradeDto,
        include: { assignment: true, user: true },
      });
      return {
        userId: newGrade.userId,
        assignmentId: newGrade.assignmentId,
        score: newGrade.score,
        grade: newGrade.grade,
        published: newGrade.published,
        late: newGrade.late,
        assignment: {
          id: newGrade.assignment.id,
          name: newGrade.assignment.name,
        },
        user: {
          id: newGrade.user.id,
          firstName: newGrade.user.firstName,
          lastName: newGrade.user.lastName,
        },
      };
    } catch (e) {
      console.error('GradesService.create error:', e);
      throw new InternalServerErrorException('Failed to create grade');
    }
  }

  // ──────────────────────────────
  // UPDATE — Existing Grade
  // ──────────────────────────────
  async update(
    userId: number,
    assignmentId: number,
    updateGradeDto: GradeUpdateIn,
  ): Promise<GradeOut> {
    try {
      const updatedGrade = await this.prisma.grades.update({
        where: { assignmentId_userId: { userId, assignmentId } },
        data: updateGradeDto,
        include: { assignment: true, user: true },
      });
      return {
        userId: updatedGrade.userId,
        assignmentId: updatedGrade.assignmentId,
        score: updatedGrade.score,
        grade: updatedGrade.grade,
        published: updatedGrade.published,
        late: updatedGrade.late,
        assignment: {
          id: updatedGrade.assignment.id,
          name: updatedGrade.assignment.name,
        },
        user: {
          id: updatedGrade.user.id,
          firstName: updatedGrade.user.firstName,
          lastName: updatedGrade.user.lastName,
        },
      };
    } catch (e) {
      console.error('GradesService.update error:', e);
      throw new InternalServerErrorException('Failed to update grade');
    }
  }

  // ──────────────────────────────
  // DELETE — Remove Grade
  // ──────────────────────────────
  async remove(userId: number, assignmentId: number): Promise<GradeOut> {
    try {
      const deletedGrade = await this.prisma.grades.delete({
        where: { assignmentId_userId: { userId, assignmentId } },
        include: { assignment: true, user: true },
      });
      return {
        userId: deletedGrade.userId,
        assignmentId: deletedGrade.assignmentId,
        score: deletedGrade.score,
        grade: deletedGrade.grade,
        published: deletedGrade.published,
        late: deletedGrade.late,
        assignment: {
          id: deletedGrade.assignment.id,
          name: deletedGrade.assignment.name,
        },
        user: {
          id: deletedGrade.user.id,
          firstName: deletedGrade.user.firstName,
          lastName: deletedGrade.user.lastName,
        },
      };
    } catch (e) {
      console.error('GradesService.remove error:', e);
      throw new InternalServerErrorException('Failed to delete grade');
    }
  }
  async findAllForUser(userId: number) {
  try {
    return this.prisma.grades.findMany({
      where: { userId },
      include: { assignment: true, user: true },
    });
  } catch (e) {
    console.error('GradesService.findAllForUser error:', e);
    throw new InternalServerErrorException('Failed to fetch user grades');
  }
}
// ──────────────────────────────
// GET — All grades for a specific course + user
// ──────────────────────────────
async findAllForCourseAndUser(courseId: number, userId: number) {
  return this.prisma.grades.findMany({
    where: { userId },
    include: {
      assignment: { select: { id: true, name: true, courseId: true } },
      user: true,
    },
  })
}



}


