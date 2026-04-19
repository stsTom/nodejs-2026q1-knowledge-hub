import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { validate as isUuid } from 'uuid';
import { Role } from '@prisma/client';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Roles } from '../rbac/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../rbac/current-user.decorator';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @Roles(Role.viewer, Role.editor, Role.admin)
  @HttpCode(HttpStatus.OK)
  getByArticle(@Query('articleId') articleId: string) {
    return this.commentsService.getAllByArticleId(articleId);
  }

  @Get(':id')
  @Roles(Role.viewer, Role.editor, Role.admin)
  @HttpCode(HttpStatus.OK)
  getById(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new BadRequestException(`"${id}" is not a valid UUID`);
    }
    return this.commentsService.findById(id);
  }

  @Post()
  @Roles(Role.editor, Role.admin)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.commentsService.create(dto, user);
  }

  @Delete(':id')
  @Roles(Role.editor, Role.admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!isUuid(id)) {
      throw new BadRequestException(`"${id}" is not a valid UUID`);
    }
    await this.commentsService.delete(id, user);
  }
}