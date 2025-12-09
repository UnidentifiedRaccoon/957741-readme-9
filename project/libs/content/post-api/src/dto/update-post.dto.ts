import { ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus } from '@project/core';

export class UpdatePostDto {
  @ApiPropertyOptional({
    description: 'Post title',
    example: 'Updated post title',
  })
  public title?: string;

  @ApiPropertyOptional({
    description: 'Post status',
    enum: PostStatus,
    example: PostStatus.PUBLISHED,
  })
  public status?: PostStatus;

  @ApiPropertyOptional({
    description: 'Extra fields depending on post type',
    example: { announcement: 'Updated preview', text: 'Updated content...' },
  })
  public extraFields?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'List of tags',
    example: ['typescript', 'nestjs'],
    type: [String],
  })
  public tags?: string[];
}

