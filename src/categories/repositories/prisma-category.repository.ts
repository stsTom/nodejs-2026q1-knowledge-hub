import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Category } from '../interfaces/category.interface';
import { CategoryRepository } from '../interfaces/category.repository';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async findById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async create(data: Pick<Category, 'name' | 'description'>): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  async update(
    id: string,
    data: Partial<Pick<Category, 'name' | 'description'>>,
  ): Promise<Category | null> {
    try {
      return await this.prisma.category.update({ where: { id }, data });
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.category.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
