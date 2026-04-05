import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticlesRepository } from './interfaces/articles.repository';
import { InMemoryArticlesRepository } from './repositories/in-memory-articles.repository';

@Module({
  controllers: [ArticlesController],
  providers: [
    ArticlesService,
    {
      provide: ArticlesRepository,
      useClass: InMemoryArticlesRepository,
    },
  ],
  exports: [ArticlesService, ArticlesRepository],
})
export class ArticlesModule {}
