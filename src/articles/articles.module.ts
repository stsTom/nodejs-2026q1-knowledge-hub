import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticlesRepository } from './interfaces/articles.repository';
import { InMemoryArticlesRepository } from './repositories/in-memory-articles.repository';

@Module({
  controllers: [ArticlesController],
  providers: [
    ArticlesService,
    // Bind the abstract token to the concrete in-memory implementation.
    // To switch to a DB-backed repository, only change this binding —
    // the service and controller remain untouched.
    {
      provide: ArticlesRepository,
      useClass: InMemoryArticlesRepository,
    },
  ],
  exports: [ArticlesService],
})
export class ArticlesModule {}
