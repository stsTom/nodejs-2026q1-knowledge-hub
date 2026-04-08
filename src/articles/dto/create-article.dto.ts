import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsUUID,
  ArrayUnique,
} from 'class-validator';
import { ArticleStatus } from '../interfaces/article.interface';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @IsOptional()
  @IsEnum(ArticleStatus, {
    message: `Status must be one of: ${Object.values(ArticleStatus).join(', ')}`,
  })
  status?: ArticleStatus;

  @IsOptional()
  @IsUUID('4', { message: 'categoryId must be a valid UUID' })
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsUUID('4', { message: 'authorId must be a valid UUID' })
  authorId?: string;
}
