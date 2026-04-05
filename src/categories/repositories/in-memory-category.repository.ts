import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Category } from '../interfaces/category.interface';
import { CategoryRepository } from '../interfaces/category.repository';

@Injectable()
export class InMemoryCategoryRepository implements CategoryRepository {
  private categories: Category[] = [
    {
      id: randomUUID(),
      name: 'Technology',
      description: 'Articles about software, hardware, and digital innovation',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      name: 'Science',
      description: 'Discoveries, research, and scientific breakthroughs',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  async findAll(): Promise<Category[]> {
    return [...this.categories];
  }

  async findById(id: string): Promise<Category | null> {
    return this.categories.find((c) => c.id === id) ?? null;
  }

  async create(data: Pick<Category, 'name' | 'description'>): Promise<Category> {
    const category: Category = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.categories.push(category);
    return { ...category };
  }

  async update(
    id: string,
    data: Partial<Pick<Category, 'name' | 'description'>>,
  ): Promise<Category | null> {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return null;

    this.categories[index] = {
      ...this.categories[index],
      ...data,
      updatedAt: new Date(),
    };
    return { ...this.categories[index] };
  }

  async delete(id: string): Promise<boolean> {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return false;

    this.categories.splice(index, 1);
    return true;
  }
}
