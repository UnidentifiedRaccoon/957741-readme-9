import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import {
  DEFAULT_COMMENT_COUNT_LIMIT,
  DEFAULT_PAGE,
} from '@project/engage-comment';

export class CommentQueryDto {
  @ApiPropertyOptional({
    description: 'Number of comments per page',
    example: DEFAULT_COMMENT_COUNT_LIMIT,
    default: DEFAULT_COMMENT_COUNT_LIMIT,
  })
  @Transform(({ value }) => {
    const num = Number(value);
    return isNaN(num) ? DEFAULT_COMMENT_COUNT_LIMIT : num;
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  public limit: number = DEFAULT_COMMENT_COUNT_LIMIT;

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
}

