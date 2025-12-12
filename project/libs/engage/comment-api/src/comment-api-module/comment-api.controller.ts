import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentApiService } from './comment-api.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentQueryDto } from '../dto/comment-query.dto';
import { CommentRdo } from '../rdo/comment.rdo';
import { fillDto } from '@project/helpers';

@ApiTags('comments')
@Controller('comments')
export class CommentApiController {
  constructor(private readonly commentApiService: CommentApiService) {}

  @ApiOperation({ summary: 'Create a comment for a post' })
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Comment created successfully',
    type: CommentRdo,
  })
  @Post(':postId')
  public async create(
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
    @Query('userId') userId: string, // TODO: Get from JWT token
  ): Promise<CommentRdo> {
    const comment = await this.commentApiService.createComment(postId, dto, userId);
    return fillDto(CommentRdo, comment.toPOJO());
  }

  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comments retrieved successfully',
    type: [CommentRdo],
  })
  @Get(':postId')
  public async getPostComments(
    @Param('postId') postId: string,
    @Query() query: CommentQueryDto,
  ): Promise<CommentRdo[]> {
    const comments = await this.commentApiService.getPostComments(postId, query);
    return comments.map((comment) => fillDto(CommentRdo, comment.toPOJO()));
  }

  @ApiOperation({ summary: 'Get comments count for a post' })
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comments count retrieved',
  })
  @Get(':postId/count')
  public async countComments(@Param('postId') postId: string): Promise<{ count: number }> {
    const count = await this.commentApiService.countPostComments(postId);
    return { count };
  }

  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'commentId', description: 'Comment ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Comment deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Comment not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'You are not the owner of this comment',
  })
  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @Param('commentId') commentId: string,
    @Query('userId') userId: string, // TODO: Get from JWT token
  ): Promise<void> {
    await this.commentApiService.deleteComment(commentId, userId);
  }

  @ApiOperation({ summary: 'Delete all comments for a post (internal use)' })
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @Delete('post/:postId')
  public async deletePostComments(@Param('postId') postId: string): Promise<{ deleted: number }> {
    const deleted = await this.commentApiService.deletePostComments(postId);
    return { deleted };
  }
}
