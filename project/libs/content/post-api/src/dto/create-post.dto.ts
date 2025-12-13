import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsObject, IsOptional, IsString, ArrayMaxSize, Length } from 'class-validator';
import { PostType } from '@project/core';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post type',
    enum: PostType,
    example: PostType.TEXT,
  })
  @IsEnum(PostType)
  public type: PostType;

  @ApiPropertyOptional({
    description: 'Post title (required for VIDEO and TEXT types)',
    example: 'My awesome blog post title',
  })
  @IsString()
  @IsOptional()
  public title?: string;

  @ApiPropertyOptional({
    description: 'Extra fields depending on post type (videoUrl, announcement, text, quoteText, quoteAuthor, photoUrl, linkUrl, linkDescription)',
    example: { announcement: 'Short preview', text: 'Full content here...' },
  })
  @IsObject()
  @IsOptional()
  public extraFields?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'List of tags (max 8, each 3-10 chars)',
    example: ['javascript', 'nodejs'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(8, { message: 'tags must contain no more than 8 elements' })
  @Length(3, 10, { each: true, message: 'each tag must be between 3 and 10 characters' })
  @IsOptional()
  public tags?: string[];
}

