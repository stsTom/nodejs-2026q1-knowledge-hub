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
import { AuthenticatedUser } from '../rbac/current-user.decorator';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(COMMENTS_REPOSITORY)
    private readonly commentsRepository: CommentsRepository,
    private readonly articlesRepository: ArticlesRepository,
  ) {}

  async getAllByArticleId(articleId: string): Promise<Comment[]> {
    return this.commentsRepository.findAllByArticleId(articleId);
  }

  async create(dto: CreateCommentDto, user: AuthenticatedUser): Promise<Comment> {
    const article = await this.articlesRepository.findById(dto.articleId);
    if (!article) {
      throw new UnprocessableEntityException(
        `Article with id "${dto.articleId}" does not exist`,
      );
    }

    const comment: Comment = {
      id: uuidv4(),
      content: dto.content,
      articleId: dto.articleId,
      authorId: user.id,
      createdAt: Date.now(),
    };

    return this.commentsRepository.create(comment);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.commentsRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Comment with id "${id}" not found`);
    }
    await this.commentsRepository.delete(id);
  }
}