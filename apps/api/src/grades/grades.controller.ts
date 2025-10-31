import { Controller, Get, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { GradesService } from './grades.service';
import { GradeCreateIn, GradeUpdateIn } from '@repo/api/grades';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  // ──────────────────────────────
  // GET — All grades for a specific user
  // ──────────────────────────────
  @Get('user/:userId')
  findAllForUser(@Param('userId') userId: string) {
    return this.gradesService.findAllForUser(+userId);
  }

  // ──────────────────────────────
// GET — All grades for a specific course + user
// ──────────────────────────────
@Get(':courseId/:userId')
findAllForCourseAndUser(
  @Param('courseId') courseId: string,
  @Param('userId') userId: string,
) {
  return this.gradesService.findAllForCourseAndUser(+courseId, +userId);
}

  // ──────────────────────────────
  // GET — One specific grade (by user + assignment)
  // ──────────────────────────────
  @Get(':userId/:assignmentId')
  findOne(
    @Param('userId') userId: string,
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.gradesService.findOne(+userId, +assignmentId);
  }

  // ──────────────────────────────
  // POST — Create new grade
  // ──────────────────────────────
  @Post()
  create(@Body() createGradeDto: GradeCreateIn) {
    return this.gradesService.create(createGradeDto);
  }

  // ──────────────────────────────
  // PUT — Update grade
  // ──────────────────────────────
  @Patch(':userId/:assignmentId')
async update(
  @Param('userId') userId: string,
  @Param('assignmentId') assignmentId: string,
  @Body() updateGradeDto: GradeUpdateIn,
) {
  return this.gradesService.update(Number(userId), Number(assignmentId), updateGradeDto);
}


  // ──────────────────────────────
  // DELETE — Delete grade
  // ──────────────────────────────
  @Delete(':userId/:assignmentId')
  remove(
    @Param('userId') userId: string,
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.gradesService.remove(+userId, +assignmentId);
  }
}
