import { Comment } from './comment.interface';

export const COMMENTS_REPOSITORY = 'COMMENTS_REPOSITORY'

export interface CommentsRepository {
  findAllByArticleId(articleId: string): Promise<Comment[]>;
  findById(id: string): Promise<Comment | undefined>;
  create(comment: Comment): Promise<Comment>;
  delete(id: string): Promise<void>;
}