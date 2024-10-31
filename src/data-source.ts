import { DataSource } from 'typeorm';
import { Course } from './course/entities/course.entity';
import { Student } from './student/entities/student.entity';
import { Instructor } from './instructor/entities/instructor.entity';
import { Assignment } from './assignment/entities/assignment.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'himali',
  password: 'root',
  database: 'db1',
  entities: [Course, Student, Instructor, Assignment],
  migrations: ['src/migration/*.ts'],
  synchronize: true,
});
