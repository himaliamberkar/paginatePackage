// src/course/dto/create-course.dto.ts
import { IsNotEmpty, IsString, IsInt, IsArray } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsInt()
  instructorId: number;
}
