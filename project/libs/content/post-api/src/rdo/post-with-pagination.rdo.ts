import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PostRdo } from './post.rdo';

export class PostWithPaginationRdo {
  @ApiProperty({
    description: 'List of posts',
    type: [PostRdo],
  })
  @Expose()
  @Type(() => PostRdo)
  public entities: PostRdo[];

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  @Expose()
  public totalPages: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  @Expose()
  public totalItems: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  @Expose()
  public currentPage: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 25,
  })
  @Expose()
  public itemsPerPage: number;
}
