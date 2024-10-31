// src/instructor/dto/create-instructor.dto.ts
import { IsString } from 'class-validator';

export class CreateInstructorDto {
  @IsString()
  name: string;

  @IsString()
  specialization: string;
}

