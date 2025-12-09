import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostType, PostStatus } from '@project/core';
import { TagRdo } from './tag.rdo';

export class PostRdo {
  @ApiProperty({
    description: 'Post unique ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  public id: string;

  @ApiProperty({
    description: 'Post type',
    enum: PostType,
    example: PostType.TEXT,
  })
  @Expose()
  public type: PostType;

  @ApiProperty({
    description: 'Post status',
    enum: PostStatus,
    example: PostStatus.PUBLISHED,
  })
  @Expose()
  public status: PostStatus;

  @ApiProperty({
    description: 'Author user ID',
    example: 'user-uuid-here',
  })
  @Expose()
  public userId: string;

  @ApiPropertyOptional({
    description: 'Post title',
    example: 'My awesome blog post',
  })
  @Expose()
  public title?: string;

  @ApiPropertyOptional({
    description: 'Extra fields based on post type',
  })
  @Expose()
  public extraFields?: Record<string, unknown>;

  @ApiProperty({
    description: 'Is this a repost',
    example: false,
  })
  @Expose()
  public isRepost: boolean;

  @ApiPropertyOptional({
    description: 'Original post ID (if repost)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @Expose()
  public originalPostId?: string;

  @ApiPropertyOptional({
    description: 'Original author ID (if repost)',
    example: 'original-user-uuid',
  })
  @Expose()
  public originalUserId?: string;

  @ApiProperty({
    description: 'Post creation date',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Expose()
  public createdAt: Date;

  @ApiProperty({
    description: 'Post publication date',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Expose()
  public publishedAt: Date;

  @ApiPropertyOptional({
    description: 'Post tags',
    type: [TagRdo],
  })
  @Expose()
  @Type(() => TagRdo)
  public tags?: TagRdo[];
}

