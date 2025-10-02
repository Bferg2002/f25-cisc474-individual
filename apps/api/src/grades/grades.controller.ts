import { Controller, Get, Param } from '@nestjs/common';
import { GradesService } from './grades.service';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get()
  findAll() {
    return this.gradesService.findAll();
  }

  @Get(':userId/:assignmentId')
  findOne(@Param('userId') userId: string, @Param('assignmentId') assignmentId: string) {
    return this.gradesService.findOne(+userId, +assignmentId);
  }
}
