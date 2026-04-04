import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { validate as isUuid } from 'uuid';
import { ArticlesRepository } from './interfaces/articles.repository';
import { Article } from './interfaces/article.interface';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleFilterDto } from './dto/article-filter.dto';

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

  async create(dto: CreateArticleDto): Promise<Article> {
    return this.articlesRepository.create(dto);
  }

  async update(id: string, dto: UpdateArticleDto): Promise<Article> {
    this.assertValidUuid(id);
    const article = await this.articlesRepository.update(id, dto);
    if (!article) {
      throw new NotFoundException(`Article with id "${id}" not found`);
    }
    return article;
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
