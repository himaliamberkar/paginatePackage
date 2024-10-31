// src/assignment/dto/create-assignment.dto.ts
import { IsNotEmpty, IsString, IsDate, IsInt } from 'class-validator';

export class CreateAssignmentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDate()
  dueDate: Date;

  @IsNotEmpty()
  @IsInt()
  courseId: number;

  @IsNotEmpty()
  @IsInt()
  studentId: number;
}

