import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PostType, SortDirection } from '@project/core';
import {
  SortBy,
  DEFAULT_POST_COUNT_LIMIT,
  DEFAULT_PAGE,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_DIRECTION,
} from '@project/content-post';

export class PostQueryDto {
  @ApiPropertyOptional({
    description: 'Number of posts per page',
    example: DEFAULT_POST_COUNT_LIMIT,
    default: DEFAULT_POST_COUNT_LIMIT,
  })
  @Transform(({ value }) => {
    const num = Number(value);
    return isNaN(num) ? DEFAULT_POST_COUNT_LIMIT : num;
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  public limit: number = DEFAULT_POST_COUNT_LIMIT;

  @ApiPropertyOptional({
    description: 'Page number',
    example: DEFAULT_PAGE,
    default: DEFAULT_PAGE,
  })
  @Transform(({ value }) => {
    const num = Number(value);
    return isNaN(num) ? DEFAULT_PAGE : num;
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  public page: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: ['publishedAt', 'likesCount', 'commentsCount'],
    example: DEFAULT_SORT_BY,
  })
  @IsOptional()
  public sortBy: SortBy = DEFAULT_SORT_BY;

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: SortDirection,
    example: DEFAULT_SORT_DIRECTION,
  })
  @IsEnum(SortDirection)
  @IsOptional()
  public sortDirection: SortDirection = DEFAULT_SORT_DIRECTION;

  @ApiPropertyOptional({
    description: 'Filter by user ID',
    example: 'user-uuid-here',
  })
  @IsString()
  @IsOptional()
  public userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by post type',
    enum: PostType,
    example: PostType.TEXT,
  })
  @IsEnum(PostType)
  @IsOptional()
  public type?: PostType;

  @ApiPropertyOptional({
    description: 'Filter by tag name',
    example: 'javascript',
  })
  @IsString()
  @IsOptional()
  public tag?: string;
}

