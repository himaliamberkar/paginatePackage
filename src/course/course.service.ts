// import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginateQuery, paginate, Paginated } from 'nestjs-paginate';  // Updated imports for nestjs-paginate
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  // Create a new course
  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create(createCourseDto);
    return this.courseRepository.save(course);
  }

  // Fetch all courses with pagination, searching, and sorting
  async findAll(query: PaginateQuery): Promise<Paginated<Course>> {
    const queryBuilder = this.courseRepository.createQueryBuilder('course');
    
    return paginate(query, queryBuilder, {
      sortableColumns: ['title', 'description'],  // Add sortable columns
      searchableColumns: ['title'],  // Add searchable columns
      defaultSortBy: [['title', 'ASC']],  // Default sorting if not provided
    });
  }

  // Find a single course by ID
  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  // Update a course
  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);
    const updatedCourse = this.courseRepository.merge(course, updateCourseDto);
    return this.courseRepository.save(updatedCourse);
  }

  // Delete a course
  async remove(id: number): Promise<void> {
    const course = await this.findOne(id);
    await this.courseRepository.remove(course);
  }

  // Fetch courses by a specific student using pagination
  async findCourseByStudent(courseId: number, query: PaginateQuery): Promise<Paginated<Course>> {
    const queryBuilder = this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.students', 'student')  // Assuming there's a 'students' relation
      .where('course.id = :courseId', { courseId });
    
    // Handle sorting manually for custom fields like 'course.name'
    if (query.sortBy && query.sortBy[0] && query.sortBy[0][0] === 'course.name') {
      queryBuilder.addOrderBy('course.name', query.sortBy[0][1] as 'ASC' | 'DESC');
    }

    return paginate(query, queryBuilder, {
      sortableColumns: ['title', 'description'],  // Use Course's fields for sorting
      searchableColumns: ['title'],  // Make title searchable
    });
  }
}
