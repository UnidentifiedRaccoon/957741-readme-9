import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LikeApiService } from './like-api.service';
import { UserIdQueryDto } from '@project/helpers';

@ApiTags('likes')
@Controller('likes')
export class LikeApiController {
  constructor(private readonly likeApiService: LikeApiService) {}

  @ApiOperation({ summary: 'Toggle like on a post' })
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Like toggled successfully',
  })
  @Post(':postId')
  public async toggleLike(
    @Param('postId') postId: string,
    @Query() { userId }: UserIdQueryDto, // TODO: Get from JWT token
  ): Promise<{ liked: boolean }> {
    return this.likeApiService.toggleLike(postId, userId);
  }

  @ApiOperation({ summary: 'Get likes count for a post' })
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Likes count retrieved',
  })
  @Get(':postId/count')
  public async countLikes(@Param('postId') postId: string): Promise<{ count: number }> {
    const count = await this.likeApiService.countLikes(postId);
    return { count };
  }

  @ApiOperation({ summary: 'Check if user liked a post' })
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Like status retrieved',
  })
  @Get(':postId/check')
  public async checkLike(
    @Param('postId') postId: string,
    @Query() { userId }: UserIdQueryDto,
  ): Promise<{ liked: boolean }> {
    const liked = await this.likeApiService.isLiked(postId, userId);
    return { liked };
  }

  @ApiOperation({ summary: 'Delete all likes for a post (internal use)' })
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @Delete(':postId')
  public async deletePostLikes(@Param('postId') postId: string): Promise<{ deleted: number }> {
    const deleted = await this.likeApiService.deletePostLikes(postId);
    return { deleted };
  }
}

