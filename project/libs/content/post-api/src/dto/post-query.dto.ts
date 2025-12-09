import { ApiPropertyOptional } from '@nestjs/swagger';
import { PostType } from '@project/core';
import { SortBy, SortDirection } from '@project/content-post';

export class PostQueryDto {
  @ApiPropertyOptional({
    description: 'Number of posts per page',
    example: 25,
    default: 25,
  })
  public limit?: number;

  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    default: 1,
  })
  public page?: number;

  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: ['publishedAt', 'likesCount', 'commentsCount'],
    example: 'publishedAt',
  })
  public sortBy?: SortBy;

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  public sortDirection?: SortDirection;

  @ApiPropertyOptional({
    description: 'Filter by user ID',
    example: 'user-uuid-here',
  })
  public userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by post type',
    enum: PostType,
    example: PostType.TEXT,
  })
  public type?: PostType;

  @ApiPropertyOptional({
    description: 'Filter by tag name',
    example: 'javascript',
  })
  public tag?: string;
}

