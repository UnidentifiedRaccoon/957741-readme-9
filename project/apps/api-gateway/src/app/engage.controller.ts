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
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { ApplicationServiceURL } from './app.config';
import { CreateCommentDto } from './dto/create-comment.dto';

// ============================================
// LIKES CONTROLLER
// ============================================
@ApiTags('likes')
@Controller('likes')
@UseFilters(AxiosExceptionFilter)
export class LikesController {
  constructor(private readonly httpService: HttpService) {}

  @ApiOperation({ summary: 'Toggle like on a post' })
  @ApiBearerAuth()
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Like toggled' })
  @UseGuards(CheckAuthGuard)
  @Post(':postId')
  public async toggleLike(
    @Param('postId') postId: string,
    @Req() req: Request & { user: { sub: string } }
  ) {
    const userId = req['user'].sub;
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Engage}/likes/${postId}`,
      null,
      { params: { userId } }
    );
    return data;
  }

  @ApiOperation({ summary: 'Get likes count for a post' })
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Likes count returned' })
  @Get(':postId/count')
  public async getLikesCount(@Param('postId') postId: string) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Engage}/likes/${postId}/count`
    );
    return data;
  }

  @ApiOperation({ summary: 'Check if current user liked a post' })
  @ApiBearerAuth()
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Like status returned' })
  @UseGuards(CheckAuthGuard)
  @Get(':postId/check')
  public async checkLike(
    @Param('postId') postId: string,
    @Req() req: Request & { user: { sub: string } }
  ) {
    const userId = req['user'].sub;
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Engage}/likes/${postId}/check`,
      { params: { userId } }
    );
    return data;
  }
}

// ============================================
// COMMENTS CONTROLLER
// ============================================
@ApiTags('comments')
@Controller('comments')
@UseFilters(AxiosExceptionFilter)
export class CommentsController {
  constructor(private readonly httpService: HttpService) {}

  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default 50)' })
  @ApiResponse({ status: 200, description: 'Comments list returned' })
  @Get(':postId')
  public async getComments(
    @Param('postId') postId: string,
    @Query() query: Record<string, unknown>
  ) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Engage}/comments/${postId}`,
      { params: query }
    );
    return data;
  }

  @ApiOperation({ summary: 'Create a comment for a post' })
  @ApiBearerAuth()
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiResponse({ status: 201, description: 'Comment created' })
  @UseGuards(CheckAuthGuard)
  @Post(':postId')
  public async createComment(
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
    @Req() req: Request & { user: { sub: string } }
  ) {
    const userId = req['user'].sub;
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Engage}/comments/${postId}`,
      dto,
      { params: { userId } }
    );
    return data;
  }

  @ApiOperation({ summary: 'Get comments count for a post' })
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Comments count returned' })
  @Get(':postId/count')
  public async getCommentsCount(@Param('postId') postId: string) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Engage}/comments/${postId}/count`
    );
    return data;
  }

  @ApiOperation({ summary: 'Delete a comment' })
  @ApiBearerAuth()
  @ApiParam({ name: 'commentId', description: 'Comment ID' })
  @ApiResponse({ status: 204, description: 'Comment deleted' })
  @ApiResponse({ status: 403, description: 'Not authorized to delete this comment' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @UseGuards(CheckAuthGuard)
  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteComment(
    @Param('commentId') commentId: string,
    @Req() req: Request & { user: { sub: string } }
  ) {
    const userId = req['user'].sub;
    await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Engage}/comments/${commentId}`,
      { params: { userId } }
    );
  }
}

// ============================================
// SUBSCRIPTIONS CONTROLLER
// ============================================
@ApiTags('subscriptions')
@Controller('subscriptions')
@UseFilters(AxiosExceptionFilter)
export class SubscriptionsController {
  constructor(private readonly httpService: HttpService) {}

  @ApiOperation({ summary: 'Subscribe to a user' })
  @ApiBearerAuth()
  @ApiParam({ name: 'userId', description: 'User ID to subscribe to' })
  @ApiResponse({ status: 200, description: 'Subscribed successfully' })
  @ApiResponse({ status: 400, description: 'Cannot subscribe to yourself' })
  @UseGuards(CheckAuthGuard)
  @Post(':userId')
  public async subscribe(
    @Param('userId') followingId: string,
    @Req() req: Request & { user: { sub: string } }
  ) {
    const followerId = req['user'].sub;
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Engage}/subscriptions/${followingId}`,
      null,
      { params: { followerId } }
    );
    return data;
  }

  @ApiOperation({ summary: 'Unsubscribe from a user' })
  @ApiBearerAuth()
  @ApiParam({ name: 'userId', description: 'User ID to unsubscribe from' })
  @ApiResponse({ status: 200, description: 'Unsubscribed successfully' })
  @UseGuards(CheckAuthGuard)
  @Delete(':userId')
  public async unsubscribe(
    @Param('userId') followingId: string,
    @Req() req: Request & { user: { sub: string } }
  ) {
    const followerId = req['user'].sub;
    const { data } = await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Engage}/subscriptions/${followingId}`,
      { params: { followerId } }
    );
    return data;
  }

  @ApiOperation({ summary: 'Get list of users that current user follows' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Following list returned' })
  @UseGuards(CheckAuthGuard)
  @Get('following')
  public async getFollowing(@Req() req: Request & { user: { sub: string } }) {
    const userId = req['user'].sub;
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Engage}/subscriptions/${userId}/following`
    );
    return data;
  }

  @ApiOperation({ summary: 'Get list of followers for current user' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Followers list returned' })
  @UseGuards(CheckAuthGuard)
  @Get('followers')
  public async getFollowers(@Req() req: Request & { user: { sub: string } }) {
    const userId = req['user'].sub;
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Engage}/subscriptions/${userId}/followers`
    );
    return data;
  }

  @ApiOperation({ summary: 'Get followers count for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Followers count returned' })
  @Get(':userId/followers/count')
  public async getFollowersCount(@Param('userId') userId: string) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Engage}/subscriptions/${userId}/followers/count`
    );
    return data;
  }

  @ApiOperation({ summary: 'Check if subscribed to a user' })
  @ApiBearerAuth()
  @ApiParam({ name: 'userId', description: 'User ID to check subscription for' })
  @ApiResponse({ status: 200, description: 'Subscription status returned' })
  @UseGuards(CheckAuthGuard)
  @Get(':userId/check')
  public async checkSubscription(
    @Param('userId') followingId: string,
    @Req() req: Request & { user: { sub: string } }
  ) {
    const followerId = req['user'].sub;
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Engage}/subscriptions/check`,
      { params: { followerId, followingId } }
    );
    return data;
  }
}


