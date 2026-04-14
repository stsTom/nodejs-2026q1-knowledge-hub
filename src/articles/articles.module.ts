import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticlesRepository } from './interfaces/articles.repository';
import { PrismaArticlesRepository } from './repositories/prisma-articles.repository'

@Module({
  controllers: [ArticlesController],
  providers: [
    ArticlesService,
    {
      provide: ArticlesRepository,
      useClass: PrismaArticlesRepository,
    },
  ],
  exports: [ArticlesService, ArticlesRepository],
})
export class ArticlesModule {}
