// src/student/dto/create-student.dto.ts
import { IsNotEmpty, IsNumber, IsString, Min, Max, IsArray} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(1)
  @Max(120)
  age: number;

  @IsArray() // To validate the array of course IDs
  @IsNumber({}, { each: true }) // To ensure each element is a number
  courses: number[];
}

