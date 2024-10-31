// src/instructor/instructor.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instructor } from './entities/instructor.entity';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { SelectQueryBuilder } from 'typeorm';

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(Instructor)
    private readonly instructorRepository: Repository<Instructor>,
  ) {}

  // Create a new instructor
  async create(createInstructorDto: CreateInstructorDto): Promise<Instructor> {
    const instructor = this.instructorRepository.create(createInstructorDto);
    return await this.instructorRepository.save(instructor);
  }

  // Fetch all instructors with pagination, searching, and sorting
  async findAll(
    page: number = 1, 
    limit: number = 10, 
    search?: string,          // Search keyword
    sortField?: string,       // Sort by field
    sortOrder: 'ASC' | 'DESC' = 'ASC'  // Sort order
  ): Promise<Pagination<Instructor>> {
    // Create a query builder for Instructor entity
    const queryBuilder: SelectQueryBuilder<Instructor> = this.instructorRepository
      .createQueryBuilder('instructor');

    // Add search functionality (search by name)
    if (search) {
      queryBuilder.where('instructor.name LIKE :search', { search: `%${search}%` });
    }

    // Add sorting functionality (sort by provided field and order)
    if (sortField) {
      queryBuilder.orderBy(`instructor.${sortField}`, sortOrder);
    } else {
      // Default sorting by ID if no field is provided
      queryBuilder.orderBy('instructor.id', 'ASC');
    }

    // Paginate using query builder
    return await paginate<Instructor>(queryBuilder, { page, limit });
  }

  // Find a single instructor by ID
  async findOne(id: number): Promise<Instructor> {
    const instructor = await this.instructorRepository.findOne({ where: { id } });
    if (!instructor) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }
    return instructor;
  }

  // Update an existing instructor
  async update(id: number, updateInstructorDto: UpdateInstructorDto): Promise<Instructor> {
    const instructor = await this.findOne(id);
    const updatedInstructor = this.instructorRepository.merge(instructor, updateInstructorDto);
    return await this.instructorRepository.save(updatedInstructor);
  }

  // Delete an instructor
  async remove(id: number): Promise<void> {
    const instructor = await this.findOne(id);
    await this.instructorRepository.remove(instructor);
  }
}



