import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Comment } from '../interfaces/comment.interface';
import { CommentsRepository } from '../interfaces/comments.repository';

function toComment(raw: any): Comment {
  return {
    ...raw,
    createdAt: raw.createdAt.getTime(),
  };
}

@Injectable()
export class PrismaCommentsRepository implements CommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByArticleId(articleId: string): Promise<Comment[]> {
    const rows = await this.prisma.comment.findMany({ where: { articleId } });
    return rows.map(toComment);
  }

  async findById(id: string): Promise<Comment | undefined> {
    const row = await this.prisma.comment.findUnique({ where: { id } });
    return row ? toComment(row) : undefined;
  }

  async create(comment: Comment): Promise<Comment> {
    const row = await this.prisma.comment.create({
      data: {
        ...comment,
        createdAt: new Date(comment.createdAt),
      },
    });
    return toComment(row);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.comment.delete({ where: { id } });
  }
}
