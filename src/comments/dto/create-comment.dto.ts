import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  articleId: string;

  @IsString()
  @IsOptional()
  authorId?: string | null;
}
