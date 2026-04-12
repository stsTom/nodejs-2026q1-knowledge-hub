import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { CategoryModule } from './categories/category.module';
import { CommentsModule } from './comments/comments.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [UsersModule, ArticlesModule, CategoryModule, CommentsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
