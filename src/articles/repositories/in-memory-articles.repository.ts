import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ArticlesRepository } from '../interfaces/articles.repository';
import { Article, ArticleStatus } from '../interfaces/article.interface';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { ArticleFilterDto } from '../dto/article-filter.dto';

@Injectable()
export class InMemoryArticlesRepository implements ArticlesRepository {
  private articles: Article[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'Getting Started with NestJS',
      content: 'NestJS is a progressive Node.js framework...',
      status: ArticleStatus.PUBLISHED,
      categoryId: undefined,
      tags: ['nodejs', 'nestjs', 'typescript'],
      authorId: undefined,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      title: 'Understanding TypeScript Generics',
      content: 'Generics allow you to write flexible, reusable code...',
      status: ArticleStatus.DRAFT,
      categoryId: undefined,
      tags: ['typescript', 'programming'],
      authorId: undefined,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
  ];

  async findAll(filters?: ArticleFilterDto): Promise<Article[]> {
    let result = [...this.articles];

    if (filters?.status) {
      result = result.filter((a) => a.status === filters.status);
    }

    if (filters?.categoryId) {
      result = result.filter((a) => a.categoryId === filters.categoryId);
    }

    if (filters?.tag) {
      result = result.filter((a) => a.tags.includes(filters.tag!));
    }

    return result;
  }

  async findById(id: string): Promise<Article | null> {
    return this.articles.find((a) => a.id === id) ?? null;
  }

  async create(dto: CreateArticleDto): Promise<Article> {
    const now = new Date();
    const article: Article = {
      id: uuidv4(),
      title: dto.title,
      content: dto.content,
      status: dto.status ?? ArticleStatus.DRAFT,
      categoryId: dto.categoryId,
      tags: dto.tags ?? [],
      authorId: dto.authorId,
      createdAt: now,
      updatedAt: now,
    };
    this.articles.push(article);
    return article;
  }

  async update(id: string, dto: UpdateArticleDto): Promise<Article | null> {
    const index = this.articles.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const updated: Article = {
      ...this.articles[index],
      ...dto,
      id,
      updatedAt: new Date(),
    };
    this.articles[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.articles.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.articles.splice(index, 1);
    return true;
  }
}
