import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { CategoryRepository } from './interfaces/category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async findById(id: string): Promise<Category> {
    this.assertValidUUID(id);
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.create(dto);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    this.assertValidUUID(id);
    const updated = await this.categoryRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.assertValidUUID(id);
    const deleted = await this.categoryRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
  }

  private assertValidUUID(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid id: ${id} is not a valid UUID`);
    }
  }
}
