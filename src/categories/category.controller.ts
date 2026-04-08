import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './interfaces/category.interface';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // GET /category — 200 + all categories
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  // GET /category/:id — 200, 400 (invalid uuid), 404 (not found)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findById(id);
  }

  // POST /category — 201 + created record, 400 (missing required fields)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(dto);
  }

  // PUT /category/:id — 200 + updated record, 400, 404
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(id, dto);
  }

  // DELETE /category/:id — 204 (deleted), 400, 404
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.categoryService.delete(id);
  }
}
