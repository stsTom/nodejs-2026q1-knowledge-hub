import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ArticlesRepository } from '../interfaces/articles.repository';
import { Article } from '../interfaces/article.interface';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { ArticleFilterDto } from '../dto/article-filter.dto';


type ArticleWithTags = Omit<Article, 'tags'> & {
  tags: { name: string }[];
};


function toArticle(raw: ArticleWithTags): Article {
  return { ...raw, tags: raw.tags.map((t) => t.name) };
}

function tagsConnectOrCreate(names: string[]) {
  return names.map((name) => ({
    where: { name },
    create: { name },
  }));
}

@Injectable()
export class PrismaArticlesRepository implements ArticlesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: ArticleFilterDto): Promise<Article[]> {
    const rows = await this.prisma.article.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.categoryId && { categoryId: filters.categoryId }),
        ...(filters?.tag && {
          tags: { some: { name: filters.tag } },
        }),
      },
      include: { tags: { select: { name: true } } },
    });

    return rows.map(toArticle);
  }

  async findById(id: string): Promise<Article | null> {
    const row = await this.prisma.article.findUnique({
      where: { id },
      include: { tags: { select: { name: true } } },
    });

    return row ? toArticle(row) : null;
  }

  async create(dto: CreateArticleDto): Promise<Article> {
    const tags = dto.tags ?? [];
    const row = await this.prisma.article.create({
      data: {
        title: dto.title,
        content: dto.content,
        status: dto.status,
        categoryId: dto.categoryId,
        authorId: dto.authorId,
        tags: { connectOrCreate: tagsConnectOrCreate(tags) },
      },
      include: { tags: { select: { name: true } } },
    });

    return toArticle(row);
  }

  async update(id: string, dto: UpdateArticleDto): Promise<Article | null> {
    try {
      const data: Parameters<typeof this.prisma.article.update>[0]['data'] = {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        ...(dto.authorId !== undefined && { authorId: dto.authorId }),
      };

      if (dto.tags !== undefined) {
        data.tags = {
          set: [],
          connectOrCreate: tagsConnectOrCreate(dto.tags),
        };
      }

      const row = await this.prisma.article.update({
        where: { id },
        data,
        include: { tags: { select: { name: true } } },
      });

      return toArticle(row);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.article.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
