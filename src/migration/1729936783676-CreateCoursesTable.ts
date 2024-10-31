import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';


export class CreateCoursesTable1729936783676 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create 'instructors' table
        await queryRunner.createTable(
          new Table({
            name: 'instructors',
            columns: [
              {
                name: 'id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
              },
              {
                name: 'name',
                type: 'varchar',
                isNullable: false,
              },
              {
                name: 'specialization',
                type: 'varchar',
                isNullable: false,
              },
            ],
          }),
        );
    
        // Create 'courses' table
        await queryRunner.createTable(
          new Table({
            name: 'courses',
            columns: [
              {
                name: 'id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
              },
              {
                name: 'title',
                type: 'varchar',
                isNullable: false,
              },
              {
                name: 'description',
                type: 'text',
                isNullable: false,
              },
              {
                name: 'instructorId',
                type: 'int',
                isNullable: true,
              },
            ],
          }),
        );
    
        // Foreign key: courses -> instructors (Many-to-One)
        await queryRunner.createForeignKey(
          'courses',
          new TableForeignKey({
            columnNames: ['instructorId'],
            referencedTableName: 'instructors',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          }),
        );
    
        // Create 'students' table
        await queryRunner.createTable(
          new Table({
            name: 'students',
            columns: [
              {
                name: 'id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
              },
              {
                name: 'name',
                type: 'varchar',
                isNullable: false,
              },
              {
                name: 'age',
                type: 'int',
                isNullable: false,
              },
            ],
          }),
        );
    
        // Create 'assignments' table
        await queryRunner.createTable(
          new Table({
            name: 'assignments',
            columns: [
              {
                name: 'id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
              },
              {
                name: 'title',
                type: 'varchar',
                isNullable: false,
              },
              {
                name: 'dueDate',
                type: 'date',
                isNullable: false,
              },
              {
                name: 'courseId',
                type: 'int',
                isNullable: false,
              },
              {
                name: 'studentId',
                type: 'int',
                isNullable: true,
              },
            ],
          }),
        );
    
        // Foreign key: assignments -> courses (Many-to-One)
        await queryRunner.createForeignKey(
          'assignments',
          new TableForeignKey({
            columnNames: ['courseId'],
            referencedTableName: 'courses',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        );
    
        // Foreign key: assignments -> students (Many-to-One)
        await queryRunner.createForeignKey(
          'assignments',
          new TableForeignKey({
            columnNames: ['studentId'],
            referencedTableName: 'students',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          }),
        );
    
        // Create 'courses_students' table for Many-to-Many relationship between Courses and Students
        await queryRunner.createTable(
          new Table({
            name: 'courses_students',
            columns: [
              {
                name: 'courseId',
                type: 'int',
              },
              {
                name: 'studentId',
                type: 'int',
              },
            ],
            foreignKeys: [
              {
                columnNames: ['courseId'],
                referencedTableName: 'courses',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
              },
              {
                columnNames: ['studentId'],
                referencedTableName: 'students',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
              },
            ],
          }),
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop many-to-many 'courses_students' table
        await queryRunner.dropTable('courses_students');
    
        // Drop 'assignments' table and foreign keys
        await queryRunner.dropTable('assignments');
    
        // Drop 'students' table
        await queryRunner.dropTable('students');
    
        // Drop foreign key and 'courses' table
        const coursesTable = await queryRunner.getTable('courses');
        const instructorForeignKey = coursesTable.foreignKeys.find((fk) => fk.columnNames.indexOf('instructorId') !== -1);
        await queryRunner.dropForeignKey('courses', instructorForeignKey);
        await queryRunner.dropTable('courses');
    
        // Drop 'instructors' table
        await queryRunner.dropTable('instructors');
      }
    }
