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
import { SubscriptionApiService } from './subscription-api.service';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionApiController {
  constructor(private readonly subscriptionApiService: SubscriptionApiService) {}

  @ApiOperation({ summary: 'Check if subscribed to a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subscription status retrieved',
  })
  @Get('check')
  public async checkSubscription(
    @Query('followerId') followerId: string,
    @Query('followingId') followingId: string,
  ): Promise<{ subscribed: boolean }> {
    const subscribed = await this.subscriptionApiService.isSubscribed(followerId, followingId);
    return { subscribed };
  }

  @ApiOperation({ summary: 'Subscribe to a user' })
  @ApiParam({ name: 'userId', description: 'User ID to subscribe to' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subscribed successfully',
  })
  @Post(':userId')
  public async subscribe(
    @Param('userId') followingId: string,
    @Query('followerId') followerId: string, // TODO: Get from JWT token
  ): Promise<{ subscribed: boolean }> {
    return this.subscriptionApiService.subscribe(followerId, followingId);
  }

  @ApiOperation({ summary: 'Unsubscribe from a user' })
  @ApiParam({ name: 'userId', description: 'User ID to unsubscribe from' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Unsubscribed successfully',
  })
  @Delete(':userId')
  public async unsubscribe(
    @Param('userId') followingId: string,
    @Query('followerId') followerId: string, // TODO: Get from JWT token
  ): Promise<{ subscribed: boolean }> {
    return this.subscriptionApiService.unsubscribe(followerId, followingId);
  }

  @ApiOperation({ summary: 'Get list of user IDs that current user follows' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Following list retrieved',
  })
  @Get(':userId/following')
  public async getFollowing(@Param('userId') userId: string): Promise<{ userIds: string[] }> {
    const userIds = await this.subscriptionApiService.getFollowingIds(userId);
    return { userIds };
  }

  @ApiOperation({ summary: 'Get list of user IDs that follow current user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Followers list retrieved',
  })
  @Get(':userId/followers')
  public async getFollowers(@Param('userId') userId: string): Promise<{ userIds: string[] }> {
    const userIds = await this.subscriptionApiService.getFollowerIds(userId);
    return { userIds };
  }

  @ApiOperation({ summary: 'Get followers count' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Followers count retrieved',
  })
  @Get(':userId/followers/count')
  public async countFollowers(@Param('userId') userId: string): Promise<{ count: number }> {
    const count = await this.subscriptionApiService.countFollowers(userId);
    return { count };
  }

  @ApiOperation({ summary: 'Get following count' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Following count retrieved',
  })
  @Get(':userId/following/count')
  public async countFollowing(@Param('userId') userId: string): Promise<{ count: number }> {
    const count = await this.subscriptionApiService.countFollowing(userId);
    return { count };
  }
}
