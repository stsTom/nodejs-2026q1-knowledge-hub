import { Article } from './article.interface';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { ArticleFilterDto } from '../dto/article-filter.dto';

export abstract class ArticlesRepository {
  abstract findAll(filters?: ArticleFilterDto): Promise<Article[]>;
  abstract findById(id: string): Promise<Article | null>;
  abstract create(dto: CreateArticleDto): Promise<Article>;
  abstract update(id: string, dto: UpdateArticleDto): Promise<Article | null>;
  abstract delete(id: string): Promise<boolean>;
}
