import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from './course/course.module';
import { StudentModule } from './student/student.module';
import { InstructorModule } from './instructor/instructor.module';
import { AssignmentModule } from './assignment/assignment.module';
import { Course } from './course/entities/course.entity';
import { Student } from './student/entities/student.entity';
import { Instructor } from './instructor/entities/instructor.entity';
import { Assignment } from './assignment/entities/assignment.entity';


@Module({
  imports: [CourseModule, StudentModule, InstructorModule, AssignmentModule,
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'himali',
    password: 'root',
    database: 'db1',
    entities: [Course, Student, Instructor, Assignment],
    synchronize: true, // Set to false to avoid auto-syncing in production
  }),
],
  controllers: [],
  providers: [],
})
export class AppModule {}
