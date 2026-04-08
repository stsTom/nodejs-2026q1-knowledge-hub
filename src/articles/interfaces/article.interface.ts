export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export interface Article {
  id: string;
  title: string;
  content: string;
  status: ArticleStatus;
  categoryId?: string;
  tags: string[];
  authorId?: string;
  createdAt: Date;
  updatedAt: Date;
}
