import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Course } from 'src/course/entities/course.entity';
import { Student } from 'src/student/entities/student.entity';
import { Pagination, paginate, IPaginationOptions } from 'nestjs-typeorm-paginate'; // Import pagination utilities

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  // Create a new assignment
  async create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    const { courseId, studentId, title, dueDate } = createAssignmentDto;

    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const student = await this.studentRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const assignment = this.assignmentRepository.create({ title, dueDate, course, student });
    return await this.assignmentRepository.save(assignment);
  }

  // Fetch all assignments with pagination, searching, and sorting
  async findAll(
    page: number = 1, 
    limit: number = 10, 
    search?: string, 
    sortBy?: string, 
    sortDirection: 'ASC' | 'DESC' = 'ASC'
  ): Promise<Pagination<Assignment>> {
    const queryBuilder = this.assignmentRepository.createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.course', 'course')  // Join course relation
      .leftJoinAndSelect('assignment.student', 'student'); // Join student relation

    // Apply searching if the `search` query is provided
    if (search) {
      queryBuilder.where('assignment.title LIKE :search', { search: `%${search}%` })
                  .orWhere('course.title LIKE :search', { search: `%${search}%` })
                  .orWhere('student.name LIKE :search', { search: `%${search}%` });
    }

    // Apply sorting if `sortBy` is provided, defaults to 'title' if not provided
    const validSortByColumns = ['assignment.title', 'assignment.dueDate', 'course.title', 'student.name'];
    const sortField = validSortByColumns.includes(sortBy) ? sortBy : 'assignment.title';
    queryBuilder.orderBy(sortField, sortDirection);  // Apply sorting

    const options: IPaginationOptions = { page, limit };
    
    // Apply pagination with QueryBuilder
    return await paginate<Assignment>(queryBuilder, options);
  }

  // Find a single assignment by ID
  async findOne(id: number): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: ['course', 'student'], // Ensure course and student relations are loaded
    });
    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }
    return assignment;
  }

  // Update an existing assignment
  async update(id: number, updateAssignmentDto: UpdateAssignmentDto): Promise<Assignment> {
    const assignment = await this.findOne(id);

    if (updateAssignmentDto.courseId) {
      const course = await this.courseRepository.findOne({ where: { id: updateAssignmentDto.courseId } });
      if (!course) {
        throw new NotFoundException(`Course with ID ${updateAssignmentDto.courseId} not found`);
      }
      assignment.course = course;
    }

    if (updateAssignmentDto.studentId) {
      const student = await this.studentRepository.findOne({ where: { id: updateAssignmentDto.studentId } });
      if (!student) {
        throw new NotFoundException(`Student with ID ${updateAssignmentDto.studentId} not found`);
      }
      assignment.student = student;
    }

    const updatedAssignment = this.assignmentRepository.merge(assignment, updateAssignmentDto);
    return await this.assignmentRepository.save(updatedAssignment);
  }

  // Delete an assignment
  async remove(id: number): Promise<void> {
    const assignment = await this.findOne(id);
    await this.assignmentRepository.remove(assignment);
  }
}
