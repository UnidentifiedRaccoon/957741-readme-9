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
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostApiService } from './post-api.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostQueryDto } from '../dto/post-query.dto';
import { parsePostQueryDto } from '../dto/post-query.parser';
import { PostRdo } from '../rdo/post.rdo';
import { PostApiResponseMessage } from './post-api-response-message.constant';
import { postToRdo, postsToRdo } from './post-api.mapper';

@ApiTags('posts')
@Controller('posts')
export class PostApiController {
  constructor(private readonly postApiService: PostApiService) {}

  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: PostApiResponseMessage.PostCreated,
    type: PostRdo,
  })
  @Post()
  public async create(
    @Body() dto: CreatePostDto,
    @Query('userId') userId: string, // TODO: Get from JWT token
  ): Promise<PostRdo> {
    const post = await this.postApiService.createPost(dto, userId);
    return postToRdo(post);
  }

  @ApiOperation({ summary: 'Get feed posts by user IDs' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: PostApiResponseMessage.PostsFound,
    type: [PostRdo],
  })
  @Post('feed')
  public async getFeed(
    @Body() body: { userIds: string[] },
    @Query() dto: PostQueryDto,
  ): Promise<PostRdo[]> {
    const { query } = parsePostQueryDto(dto);
    const posts = await this.postApiService.getFeed(body.userIds, query);
    return postsToRdo(posts);
  }

  @ApiOperation({ summary: 'Get user drafts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: PostApiResponseMessage.PostsFound,
    type: [PostRdo],
  })
  @Get('drafts/:userId')
  public async getDrafts(@Param('userId') userId: string): Promise<PostRdo[]> {
    const posts = await this.postApiService.getUserDrafts(userId);
    return postsToRdo(posts);
  }

  @ApiOperation({ summary: 'Search posts by title' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: PostApiResponseMessage.SearchResults,
    type: [PostRdo],
  })
  @Get('search/:query')
  public async search(
    @Param('query') query: string,
    @Query('limit') limit?: number,
  ): Promise<PostRdo[]> {
    const posts = await this.postApiService.searchByTitle(query, limit);
    return postsToRdo(posts);
  }

  @ApiOperation({ summary: 'Get user posts count' })
  @Get('count/:userId')
  public async countUserPosts(@Param('userId') userId: string): Promise<{ count: number }> {
    const count = await this.postApiService.countUserPosts(userId);
    return { count };
  }

  @ApiOperation({ summary: 'Create a repost' })
  @ApiParam({ name: 'id', description: 'Original post ID' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: PostApiResponseMessage.RepostCreated,
    type: PostRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PostApiResponseMessage.PostNotFound,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: PostApiResponseMessage.RepostExists,
  })
  @Post(':id/repost')
  public async repost(
    @Param('id') id: string,
    @Query('userId') userId: string, // TODO: Get from JWT token
  ): Promise<PostRdo> {
    const post = await this.postApiService.createRepost(id, userId);
    return postToRdo(post);
  }

  @ApiOperation({ summary: 'Get post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: PostApiResponseMessage.PostFound,
    type: PostRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PostApiResponseMessage.PostNotFound,
  })
  @Get(':id')
  public async getOne(@Param('id') id: string): Promise<PostRdo> {
    const post = await this.postApiService.getPost(id);
    return postToRdo(post);
  }

  @ApiOperation({ summary: 'Update post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: PostApiResponseMessage.PostUpdated,
    type: PostRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PostApiResponseMessage.PostNotFound,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: PostApiResponseMessage.PostForbidden,
  })
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @Query('userId') userId: string, // TODO: Get from JWT token
  ): Promise<PostRdo> {
    const post = await this.postApiService.updatePost(id, dto, userId);
    return postToRdo(post);
  }

  @ApiOperation({ summary: 'Delete post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: PostApiResponseMessage.PostDeleted,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PostApiResponseMessage.PostNotFound,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: PostApiResponseMessage.PostForbidden,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @Param('id') id: string,
    @Query('userId') userId: string, // TODO: Get from JWT token
  ): Promise<void> {
    await this.postApiService.deletePost(id, userId);
  }

  @ApiOperation({ summary: 'Get published posts list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: PostApiResponseMessage.PostsFound,
    type: [PostRdo],
  })
  @Get()
  public async getMany(@Query() dto: PostQueryDto): Promise<PostRdo[]> {
    const { filter, query } = parsePostQueryDto(dto);
    const posts = await this.postApiService.getPublishedPosts(filter, query);
    return postsToRdo(posts);
  }
}
