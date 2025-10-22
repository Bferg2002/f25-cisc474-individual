import { Controller, Get, Param } from '@nestjs/common';
import { GradesService } from './grades.service';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get()
  async findAll() {
    return this.gradesService.findAll();
  }

  @Get(':userId/:assignmentId')
  async findOne(
    @Param('userId') userId: string,
    @Param('assignmentId') assignmentId: string
  ) {
    return this.gradesService.findOne(+userId, +assignmentId);
  }
}
