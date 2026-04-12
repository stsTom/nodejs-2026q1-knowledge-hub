import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { COMMENTS_REPOSITORY, CommentsRepository } from './interfaces/comments.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './interfaces/comment.interface';
import { ArticlesRepository } from '../articles/interfaces/articles.repository';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(COMMENTS_REPOSITORY)

    private readonly commentsRepository: CommentsRepository,
    private readonly articlesRepository: ArticlesRepository,
  ) {}

  async getAllByArticleId(articleId: string): Promise<Comment[]> {
    const comments = await this.commentsRepository.findAllByArticleId(articleId);
    return comments
  }

  async create(dto: CreateCommentDto): Promise<Comment> {
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
