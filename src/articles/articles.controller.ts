import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleFilterDto } from './dto/article-filter.dto';
import { Article } from './interfaces/article.interface';
import { Roles } from '../rbac/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../rbac/current-user.decorator';

@Controller('article')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @Roles(Role.viewer, Role.editor, Role.admin)
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filters: ArticleFilterDto): Promise<Article[]> {
    return this.articlesService.findAll(filters);
  }

  @Get(':id')
  @Roles(Role.viewer, Role.editor, Role.admin)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Article> {
    return this.articlesService.findById(id);
  }

  @Post()
  @Roles(Role.editor, Role.admin)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateArticleDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Article> {
    return this.articlesService.create(dto, user);
  }

  @Put(':id')
  @Roles(Role.editor, Role.admin)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateArticleDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Article> {
    return this.articlesService.update(id, dto, user);
  }

  @Delete(':id')
  @Roles(Role.admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.articlesService.delete(id);
  }
}