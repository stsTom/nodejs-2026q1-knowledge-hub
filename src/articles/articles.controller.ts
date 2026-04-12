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
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleFilterDto } from './dto/article-filter.dto';
import { Article } from './interfaces/article.interface';

@Controller('article')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filters: ArticleFilterDto): Promise<Article[]> {
    return this.articlesService.findAll(filters);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Article> {
    return this.articlesService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateArticleDto): Promise<Article> {
    return this.articlesService.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateArticleDto,
  ): Promise<Article> {
    return this.articlesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.articlesService.delete(id);
  }
}
