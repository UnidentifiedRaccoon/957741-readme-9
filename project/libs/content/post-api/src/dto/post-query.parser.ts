import { PostQueryDto } from './post-query.dto';
import { PostFilter, PostQuery } from '@project/content-post';

export function parsePostQueryDto(dto: PostQueryDto): {
  filter: PostFilter;
  query: PostQuery;
} {
  return {
    filter: {
      userId: dto.userId,
      type: dto.type,
      tag: dto.tag,
    },
    query: {
      limit: dto.limit,
      page: dto.page,
      sortBy: dto.sortBy,
      sortDirection: dto.sortDirection,
    },
  };
}

