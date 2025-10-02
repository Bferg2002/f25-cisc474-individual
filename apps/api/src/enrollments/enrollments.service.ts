import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.enrollment.findMany();
  }

  findOne(userId: number, courseId: number) {
    return this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
  }
}
