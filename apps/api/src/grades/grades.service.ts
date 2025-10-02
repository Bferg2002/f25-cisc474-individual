import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.grades.findMany();
  }

  findOne(userId: number, assignmentId: number) {
    return this.prisma.grades.findUnique({
      where: { assignmentId_userId: { userId, assignmentId } },
    });
  }
}
