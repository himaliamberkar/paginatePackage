import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Course } from 'src/course/entities/course.entity';
import { Assignment } from 'src/assignment/entities/assignment.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @ManyToMany(() => Course, (course) => course.students, {
    cascade: ['insert', 'update'], // Allows inserting related courses when saving student
  
  })
  courses: Course[];


  @OneToMany(() => Assignment, (assignment) => assignment.student)
  assignments: Assignment[];
}

