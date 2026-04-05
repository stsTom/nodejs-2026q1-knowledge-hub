import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsRepository } from './interfaces/comments.repository';
import { InMemoryCommentsRepository } from './repositories/in-memory-comments.repository';
import { ArticlesModule } from '../articles/articles.module';

@Module({
  imports: [ArticlesModule],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    {
      provide: CommentsRepository,
      useClass: InMemoryCommentsRepository,
    },
  ],
})
export class CommentsModule {}
