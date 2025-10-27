import { Controller, Get, Param } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('assignments')
@UseGuards(AuthGuard('jwt'))
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  findAll() {
    return this.assignmentsService.findAll();
  }

  @Get(':id/:courseId')
  findOne(@Param('id') id: string, @Param('courseId') courseId: string) {
    return this.assignmentsService.findOne(+id, +courseId);
  }
}
