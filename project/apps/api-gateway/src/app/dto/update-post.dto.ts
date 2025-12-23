import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  ArrayMaxSize,
  Length,
} from 'class-validator';

export class UpdatePostDto {
  @ApiPropertyOptional({
    description: 'Post title (min 20, max 50 characters)',
    example: 'Updated blog post title here',
    minLength: 20,
    maxLength: 50,
  })
  @IsString()
  @Length(20, 50, { message: 'Title must be between 20 and 50 characters' })
  @IsOptional()
  public title?: string;

  @ApiPropertyOptional({
    description: 'Extra fields depending on post type',
    example: { announcement: 'Updated preview', text: 'Updated content...' },
  })
  @IsObject()
  @IsOptional()
  public extraFields?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'List of tags (max 8, each 3-10 chars)',
    example: ['updated', 'tags'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(8, { message: 'tags must contain no more than 8 elements' })
  @Length(3, 10, { each: true, message: 'each tag must be between 3 and 10 characters' })
  @IsOptional()
  public tags?: string[];

  @ApiPropertyOptional({
    description: 'Set post as draft',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  public isDraft?: boolean;
}


