import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany, JoinTable } from 'typeorm';
import { Student } from 'src/student/entities/student.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Assignment } from 'src/assignment/entities/assignment.entity';
@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToMany(() => Student, (student) => student.courses,{
    cascade:  ['insert', 'update', 'remove'],// Allows inserting related students when saving course

  })
  @JoinTable()
  students: Student[];

  @ManyToOne(() => Instructor, (instructor) => instructor.courses)
  instructor: Instructor;

  @OneToMany(() => Assignment, (assignment) => assignment.course)
  assignments: Assignment[];
}

