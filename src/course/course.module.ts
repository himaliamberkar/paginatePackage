import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Course } from './entities/course.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Student } from 'src/student/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Instructor, Student])],
  controllers: [CourseController],
  providers: [CourseService],
  exports:[TypeOrmModule],
})
export class CourseModule {}
