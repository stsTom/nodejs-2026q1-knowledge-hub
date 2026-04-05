import { Injectable } from '@nestjs/common';
import { Comment } from '../interfaces/comment.interface';
import { CommentsRepository } from '../interfaces/comments.repository';

@Injectable()
export class InMemoryCommentsRepository implements CommentsRepository {
  private readonly comments: Comment[] = [];

  findAllByArticleId(articleId: string): Comment[] {
    return this.comments.filter((c) => c.articleId === articleId);
  }

  findById(id: string): Comment | undefined {
    return this.comments.find((c) => c.id === id);
  }

  create(comment: Comment): Comment {
    this.comments.push(comment);
    return comment;
  }

  delete(id: string): void {
    const index = this.comments.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.comments.splice(index, 1);
    }
  }
}
