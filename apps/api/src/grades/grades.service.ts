// apps/api/src/grades/grades.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // make sure this path is correct

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.grades.findMany({
      include: {
        assignment: true, // include assignment to get names
        user: true,
      },
    });
  }

  async findOne(userId: number, assignmentId: number) {
    return this.prisma.grades.findUnique({
      where: {
        assignmentId_userId: {
          userId,
          assignmentId,
        },
      },
      include: {
        assignment: true,
        user: true,
      },
    });
  }
}
