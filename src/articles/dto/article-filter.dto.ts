import { IsOptional, IsEnum, IsString, IsUUID } from 'class-validator';
import { ArticleStatus } from '../interfaces/article.interface';

export class ArticleFilterDto {
  @IsOptional()
  @IsEnum(ArticleStatus, {
    message: `Status must be one of: ${Object.values(ArticleStatus).join(', ')}`,
  })
  status?: ArticleStatus;

  @IsOptional()
  @IsUUID('4', { message: 'categoryId must be a valid UUID' })
  categoryId?: string;

  @IsOptional()
  @IsString()
  tag?: string;
}
