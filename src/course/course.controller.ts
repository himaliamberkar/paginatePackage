// // src/course/course.controller.ts
// import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
// import { CourseService } from './course.service';
// import { CreateCourseDto } from './dto/create-course.dto';
// import { UpdateCourseDto } from './dto/update-course.dto';
// import { Pagination } from 'nestjs-typeorm-paginate';
// import { Course } from './entities/course.entity';
// import { Paginated, PaginateQuery } from 'nestjs-paginate';

// @Controller('course')
// export class CourseController {
//   constructor(private readonly courseService: CourseService) {}

//   @Post()
//   create(@Body() createCourseDto: CreateCourseDto) {
//     return this.courseService.create(createCourseDto);
//   }

//   @Get()
//   findAll(
//     @Query('page') page: number = 1,
//     @Query('limit') limit: number = 10
//   ): Promise<Pagination<Course>> {
//     return this.courseService.findAll(page, limit);
//   }

//   // @Get('student/:studentId')
//   // async getStudentsByCourse(
//   //   @Param('studentId') studentId: number,
//   //   @Query() query: PaginateQuery
//   // ): Promise<Paginated<Course>> {
//   //   return this.courseService.findCourseByStudent(studentId, query);
//   // }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.courseService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
//     return this.courseService.update(+id, updateCourseDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.courseService.remove(+id);
//   }
// }


import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { Course } from './entities/course.entity';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  // Get courses with pagination and query features
  @Get()
  async findAll(@Query() query: PaginateQuery): Promise<Paginated<Course>> {
    return this.courseService.findAll(query);
  }

  // If you want to get courses by studentId (you can uncomment this part)
  @Get('student/:studentId')
  async getStudentsByCourse(
    @Param('studentId') studentId: number,
    @Query() query: PaginateQuery
  ): Promise<Paginated<Course>> {
    return this.courseService.findCourseByStudent(studentId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
}
