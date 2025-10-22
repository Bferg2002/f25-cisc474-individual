import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      return this.prisma.grades.findMany({
        include: { assignment: true, user: true },
      });
    } catch (e) {
      console.error('GradesService.findAll error:', e);
      throw new InternalServerErrorException('Failed to fetch grades');
    }
  }

  async findOne(userId: number, assignmentId: number) {
    try {
      return this.prisma.grades.findUnique({
        where: { assignmentId_userId: { userId, assignmentId } },
        include: { assignment: true, user: true },
      });
    } catch (e) {
      console.error('GradesService.findOne error:', e);
      throw new InternalServerErrorException('Failed to fetch grade');
    }
  }
}
