import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { Course } from 'src/course/entities/course.entity';
import { Student } from 'src/student/entities/student.entity';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports:[TypeOrmModule.forFeature([Assignment,Course,Student]),
  CourseModule,
],
  controllers: [AssignmentController],
  providers: [AssignmentService],
})
export class AssignmentModule {}
