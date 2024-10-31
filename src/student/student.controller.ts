// src/student/student.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { Student } from './entities/student.entity';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }


  @Get()
  async getStudents(@Query() query: PaginateQuery): Promise<Paginated<Student>> {
    return this.studentService.findAll(query);
  }


@Get('course/:courseId')
  async getStudentsByCourse(
    @Param('courseId') courseId: number,
    @Query() query: PaginateQuery
  ): Promise<Paginated<Student>> {
    return this.studentService.findStudentsByCourse(courseId, query);
  }

  // Get students by age (example filter)
  @Get('age/:age')
  async getStudentsByAge(
    @Param('age') age: number,
    @Query() query: PaginateQuery
  ): Promise<Paginated<Student>> {
    return this.studentService.findStudentsByAge(age, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }
}

