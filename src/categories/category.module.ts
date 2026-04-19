import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './interfaces/category.repository';
import { PrismaCategoryRepository } from './repositories/prisma-category.repository';

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository,
    },
  ],
  exports: [CategoryService],
})
export class CategoryModule {}