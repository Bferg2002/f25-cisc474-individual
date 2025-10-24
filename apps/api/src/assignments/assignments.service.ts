import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AssignmentOut } from '@repo/api/assignments';


@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<AssignmentOut[]> {
    const assignments = await this.prisma.assignment.findMany();
    // Convert Prisma models to simple DTOs
    return assignments.map((a) => ({
      id: a.id,
      courseId: a.courseId,
      name: a.name,
    }));
  }

  async findOne(id: number, courseId: number): Promise<AssignmentOut | null> {
    const a = await this.prisma.assignment.findUnique({
      where: { id_courseId: { id, courseId } },
    });
    if (!a) return null;
    return {
      id: a.id,
      courseId: a.courseId,
      name: a.name,
    };
  }
}
