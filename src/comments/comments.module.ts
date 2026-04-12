import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { COMMENTS_REPOSITORY } from './interfaces/comments.repository'
import { PrismaCommentsRepository } from './repositories/prisma-comments.repository';
import { ArticlesModule } from '../articles/articles.module';

@Module({
  imports: [ArticlesModule],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    {
      provide: COMMENTS_REPOSITORY,
      useClass: PrismaCommentsRepository,
    },
  ],
})
export class CommentsModule {}
