import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Course } from 'src/course/entities/course.entity';
import { Student } from 'src/student/entities/student.entity';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  dueDate: Date;

  @ManyToOne(() => Course, (course) => course.assignments)
  course: Course;

  @ManyToOne(() => Student, (student) => student.assignments)
  student: Student;
}
