// src/student/student.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Student } from './entities/student.entity';
import { Course } from 'src/course/entities/course.entity';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [TypeOrmModule.forFeature([Student,Course]),
  CourseModule], // Importing Student entity
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
