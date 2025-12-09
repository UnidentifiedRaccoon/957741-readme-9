import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostType } from '@project/core';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post type',
    enum: PostType,
    example: PostType.TEXT,
  })
  public type: PostType;

  @ApiPropertyOptional({
    description: 'Post title (required for VIDEO and TEXT types)',
    example: 'My awesome blog post title',
  })
  public title?: string;

  @ApiPropertyOptional({
    description: 'Extra fields depending on post type (videoUrl, announcement, text, quoteText, quoteAuthor, photoUrl, linkUrl, linkDescription)',
    example: { announcement: 'Short preview', text: 'Full content here...' },
  })
  public extraFields?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'List of tags (max 8, each 3-10 chars)',
    example: ['javascript', 'nodejs'],
    type: [String],
  })
  public tags?: string[];
}

