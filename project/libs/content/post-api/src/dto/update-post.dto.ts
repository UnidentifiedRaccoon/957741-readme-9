import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsObject, IsOptional, IsString, ArrayMaxSize, Length } from 'class-validator';
import { PostStatus } from '@project/core';

export class UpdatePostDto {
  @ApiPropertyOptional({
    description: 'Post title',
    example: 'Updated post title',
  })
  @IsString()
  @IsOptional()
  public title?: string;

  @ApiPropertyOptional({
    description: 'Post status',
    enum: PostStatus,
    example: PostStatus.PUBLISHED,
  })
  @IsEnum(PostStatus)
  @IsOptional()
  public status?: PostStatus;

  @ApiPropertyOptional({
    description: 'Extra fields depending on post type',
    example: { announcement: 'Updated preview', text: 'Updated content...' },
  })
  @IsObject()
  @IsOptional()
  public extraFields?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'List of tags',
    example: ['typescript', 'nestjs'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(8)
  @Length(3, 10, { each: true })
  @IsOptional()
  public tags?: string[];
}

