import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { validate as isUuid } from 'uuid';
import { Role } from '@prisma/client';
import { ArticlesRepository } from './interfaces/articles.repository';
import { Article } from './interfaces/article.interface';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleFilterDto } from './dto/article-filter.dto';
import { AuthenticatedUser } from '../rbac/current-user.decorator';

@Injectable()
export class ArticlesService {
  constructor(private readonly articlesRepository: ArticlesRepository) {}

  async findAll(filters: ArticleFilterDto): Promise<Article[]> {
    return this.articlesRepository.findAll(filters);
  }

  async findById(id: string): Promise<Article> {
    this.assertValidUuid(id);
    const article = await this.articlesRepository.findById(id);
    if (!article) {
      throw new NotFoundException(`Article with id "${id}" not found`);
    }
    return article;
  }

  async create(dto: CreateArticleDto, user: AuthenticatedUser): Promise<Article> {
    return this.articlesRepository.create({ ...dto, authorId: user.id });
  }

  async update(id: string, dto: UpdateArticleDto, user: AuthenticatedUser): Promise<Article> {
    this.assertValidUuid(id);
    const article = await this.articlesRepository.findById(id);
    if (!article) {
      throw new NotFoundException(`Article with id "${id}" not found`);
    }

    if (user.role === Role.editor && article.authorId !== user.id) {
      throw new ForbiddenException('You can only edit your own articles');
    }

    const updated = await this.articlesRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Article with id "${id}" not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.assertValidUuid(id);
    const deleted = await this.articlesRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Article with id "${id}" not found`);
    }
  }

  private assertValidUuid(id: string): void {
    if (!isUuid(id)) {
      throw new BadRequestException(
        `Invalid id "${id}": must be a valid UUID v4`,
      );
    }
  }
}