import { Category } from './category.interface';

export abstract class CategoryRepository {
  abstract findAll(): Promise<Category[]>;
  abstract findById(id: string): Promise<Category | null>;
  abstract create(
    data: Pick<Category, 'name' | 'description'>,
  ): Promise<Category>;
  abstract update(
    id: string,
    data: Partial<Pick<Category, 'name' | 'description'>>,
  ): Promise<Category | null>;
  abstract delete(id: string): Promise<boolean>;
}
