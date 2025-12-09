import { ApiPropertyOptional } from '@nestjs/swagger';

export class CommentQueryDto {
  @ApiPropertyOptional({
    description: 'Number of comments per page',
    example: 50,
    default: 50,
  })
  public limit?: number;

  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    default: 1,
  })
  public page?: number;
}

