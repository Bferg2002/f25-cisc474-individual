import { Controller, Get, Param } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get()
  findAll() {
    return this.enrollmentsService.findAll();
  }

  @Get(':userId/:courseId')
  findOne(@Param('userId') userId: string, @Param('courseId') courseId: string) {
    return this.enrollmentsService.findOne(+userId, +courseId);
  }
}
