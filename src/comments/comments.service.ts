import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CommentsRepository } from './interfaces/comments.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './interfaces/comment.interface';
import { ArticlesRepository } from '../articles/interfaces/articles.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly articlesRepository: ArticlesRepository,
  ) {}

  getAllByArticleId(articleId: string): Comment[] {
    return this.commentsRepository.findAllByArticleId(articleId);
  }

  create(dto: CreateCommentDto): Comment {
    const article = this.articlesRepository.findById(dto.articleId);
    if (!article) {
      throw new UnprocessableEntityException(
        `Article with id "${dto.articleId}" does not exist`,
      );
    }

    const comment: Comment = {
      id: uuidv4(),
      content: dto.content,
      articleId: dto.articleId,
      authorId: dto.authorId ?? null,
      createdAt: Date.now(),
    };

    return this.commentsRepository.create(comment);
  }

  delete(id: string): void {
    const existing = this.commentsRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Comment with id "${id}" not found`);
    }
    this.commentsRepository.delete(id);
  }
}
