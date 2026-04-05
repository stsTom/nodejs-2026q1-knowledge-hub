import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './interfaces/category.repository';
import { InMemoryCategoryRepository } from './repositories/in-memory-category.repository';

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      // Bind the abstract token to the concrete in-memory implementation.
      // To switch to a DB-backed repo later, replace only this line:
      //   provide:  CategoryRepository,
      //   useClass: TypeOrmCategoryRepository,   ← swap here, nothing else changes
      provide: CategoryRepository,
      useClass: InMemoryCategoryRepository,
    },
  ],
  // Export CategoryRepository so other modules (e.g. ArticleModule) can
  // listen to category.deleted events and nullify their categoryId fields.
  exports: [CategoryService],
})
export class CategoryModule {}
