import { Comment } from './comment.interface';

export abstract class CommentsRepository {
  abstract findAllByArticleId(articleId: string): Comment[];
  abstract findById(id: string): Comment | undefined;
  abstract create(comment: Comment): Comment;
  abstract delete(id: string): void;
}
