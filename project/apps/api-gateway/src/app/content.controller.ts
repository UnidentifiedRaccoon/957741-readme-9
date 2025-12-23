import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
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
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApplicationServiceURL } from './app.config';
import { InjectUserIdInterceptor } from '@project/interceptors';

@ApiTags('blog')
@Controller('blog')
@UseFilters(AxiosExceptionFilter)
export class ContentController {
  constructor(private readonly httpService: HttpService) {}

  @ApiOperation({ summary: 'Get published posts list' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by post type' })
  @ApiQuery({ name: 'tag', required: false, description: 'Filter by tag' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by: publishedAt, likesCount, commentsCount' })
  @ApiResponse({ status: 200, description: 'Posts list returned' })
  @Get()
  public async getPosts(@Query() query: Record<string, unknown>) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Content}`,
      { params: query }
    );
    return data;
  }

  @ApiOperation({ summary: 'Search posts by title' })
  @ApiParam({ name: 'query', description: 'Search query' })
  @ApiQuery({ name: 'limit', required: false, description: 'Max results (default 20)' })
  @ApiResponse({ status: 200, description: 'Search results returned' })
  @Get('search/:query')
  public async search(
    @Param('query') query: string,
    @Query('limit') limit?: number
  ) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Content}/search/${encodeURIComponent(query)}`,
      { params: { limit } }
    );
    return data;
  }

  @ApiOperation({ summary: 'Get user drafts' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Drafts list returned' })
  @UseGuards(CheckAuthGuard)
  @Get('drafts')
  public async getDrafts(@Req() req: Request & { user: { sub: string } }) {
    const userId = req['user'].sub;
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Content}/drafts/${userId}`
    );
    return data;
  }

  @ApiOperation({ summary: 'Get user feed (posts from subscriptions)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Feed posts returned' })
  @UseGuards(CheckAuthGuard)
  @Get('feed')
  public async getFeed(
    @Query() query: Record<string, unknown>,
    @Req() req: Request & { user: { sub: string } }
  ) {
    const userId = req['user'].sub;

    // Get following user IDs from engage service
    const { data: followingData } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Engage}/subscriptions/${userId}/following`
    );

    // Include user's own posts in the feed
    const userIds = [...followingData.userIds, userId];

    // Get posts from content service
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Content}/feed`,
      { userIds },
      { params: query }
    );

    return data;
  }

  @ApiOperation({ summary: 'Get post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post found' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @Get(':id')
  public async getPost(@Param('id') id: string) {
    const { data: post } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Content}/${id}`
    );

    // Enrich post with likes and comments counts from engage service
    const [likesCount, commentsCount] = await Promise.all([
      this.httpService.axiosRef
        .get(`${ApplicationServiceURL.Engage}/likes/${id}/count`)
        .then((res) => res.data.count)
        .catch(() => 0),
      this.httpService.axiosRef
        .get(`${ApplicationServiceURL.Engage}/comments/${id}/count`)
        .then((res) => res.data.count)
        .catch(() => 0),
    ]);

    return {
      ...post,
      likesCount,
      commentsCount,
    };
  }

  @ApiOperation({ summary: 'Create a new post' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Post created' })
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @Post()
  public async create(@Body() dto: CreatePostDto) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Content}`,
      dto
    );
    return data;
  }

  @ApiOperation({ summary: 'Create a repost' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Original post ID' })
  @ApiResponse({ status: 201, description: 'Repost created' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 409, description: 'Already reposted' })
  @UseGuards(CheckAuthGuard)
  @Post(':id/repost')
  public async repost(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } }
  ) {
    const userId = req['user'].sub;
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Content}/${id}/repost`,
      null,
      { params: { userId } }
    );
    return data;
  }

  @ApiOperation({ summary: 'Update a post' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post updated' })
  @ApiResponse({ status: 403, description: 'Not authorized to update this post' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @UseGuards(CheckAuthGuard)
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @Req() req: Request & { user: { sub: string } }
  ) {
    const userId = req['user'].sub;
    const { data } = await this.httpService.axiosRef.patch(
      `${ApplicationServiceURL.Content}/${id}`,
      dto,
      { params: { userId } }
    );
    return data;
  }

  @ApiOperation({ summary: 'Delete a post' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 204, description: 'Post deleted' })
  @ApiResponse({ status: 403, description: 'Not authorized to delete this post' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @UseGuards(CheckAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } }
  ) {
    const userId = req['user'].sub;

    // Delete post with cascading delete of likes and comments
    await Promise.all([
      this.httpService.axiosRef.delete(`${ApplicationServiceURL.Engage}/likes/${id}`),
      this.httpService.axiosRef.delete(`${ApplicationServiceURL.Engage}/comments/post/${id}`),
    ]);

    await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Content}/${id}`,
      { params: { userId } }
    );
  }
}