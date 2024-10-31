
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery, Paginated, FilterOperator } from 'nestjs-paginate';
import { Student } from './entities/student.entity';
import { Course } from 'src/course/entities/course.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  // Create a new student
  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const { courses, ...studentData } = createStudentDto; // Extract courses from DTO
    
    const student = this.studentRepository.create(studentData); // Create student without courses

    // Fetch courses based on the provided course IDs
    if (courses && courses.length > 0) {
      const courseEntities = await this.courseRepository.findByIds(courses); // Assuming course IDs are provided
      student.courses = courseEntities; // Assign Course entities to the student
    }

    return await this.studentRepository.save(student);
  }

  // Fetch all students with pagination, sorting, filtering, and searching
 async findAll(query: PaginateQuery): Promise<Paginated<Student>> {
    return paginate(query, this.studentRepository, {
      relations: ['courses'],  // Include relations for filtering and sorting
      sortableColumns: ['id', 'name', 'age'],  // Sortable columns for the Student entity
      searchableColumns: ['name'],  // Allow searching by name
      filterableColumns: {
        age: [FilterOperator.EQ, FilterOperator.IN],  // Enable filtering by age
      },
      defaultSortBy: [['id', 'ASC']],
    });
  }

  // Fetch students by course with pagination
  async findStudentsByCourse(courseId: number, query: PaginateQuery): Promise<Paginated<Student>> {
    const queryBuilder = this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.courses', 'course')
      .where('course.id = :courseId', { courseId });
  
    // Manually handle sorting by course.name
    if (query.sortBy && query.sortBy[0] && query.sortBy[0][0] === 'course.name') {
      queryBuilder.addOrderBy('course.name', query.sortBy[0][1] as 'ASC' | 'DESC');
    }
  
    return paginate(query, queryBuilder, {
      sortableColumns: ['name', 'age'],  // Use only Student's fields
    });
  }

  // Fetch students by age with pagination
  async findStudentsByAge(age: number, query: PaginateQuery): Promise<Paginated<Student>> {
    const queryBuilder = this.studentRepository
      .createQueryBuilder('student')
      .where('student.age = :age', { age });

    return paginate(query, queryBuilder, {
      sortableColumns: ['name', 'age'],
    });
  }



  
  // Find a single student by ID
  async findOne(id: number): Promise<Student> {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  // Update an existing student
  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);
  
    const { courses, ...updateData } = updateStudentDto; // Extract courses from DTO
  
    // If courses are being updated, fetch the actual Course entities
    if (courses && courses.length > 0) {
      const courseEntities = await this.courseRepository.findByIds(courses);
      student.courses = courseEntities; // Assign actual Course entities to the student
    }
  
    const updatedStudent = this.studentRepository.merge(student, updateData); // Merge other updated fields
    return await this.studentRepository.save(updatedStudent);
  }
  
  

  // Delete a student
  async remove(id: number): Promise<void> {
    const student = await this.findOne(id);
    await this.studentRepository.remove(student);
  }
}

