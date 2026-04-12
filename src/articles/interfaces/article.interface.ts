// export enum ArticleStatus {
//   DRAFT = 'draft',
//   PUBLISHED = 'published',
//   ARCHIVED = 'archived',
// }

export { ArticleStatus } from "@prisma/client";

export interface Article {
  id: string;
  title: string;
  content: string;
  status: import('@prisma/client').ArticleStatus;
  categoryId?: string;
  tags: string[];
  authorId?: string;
  createdAt: Date;
  updatedAt: Date;
}
