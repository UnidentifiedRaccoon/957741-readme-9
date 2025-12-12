import { SortDirection } from '@project/core';
import {
  DEFAULT_POST_COUNT_LIMIT,
  DEFAULT_PAGE,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_DIRECTION,
} from './post.constant';

export type SortBy = 'publishedAt' | 'likesCount' | 'commentsCount';

export interface PostQuery {
  limit?: number;
  page?: number;
  sortBy?: SortBy;
  sortDirection?: SortDirection;
}

export interface NormalizedPostQuery {
  limit: number;
  page: number;
  sortBy: SortBy;
  sortDirection: SortDirection;
  offset: number;
}

export function normalizePostQuery(query?: PostQuery): NormalizedPostQuery {
  const limit = query?.limit ?? DEFAULT_POST_COUNT_LIMIT;
  const page = query?.page ?? DEFAULT_PAGE;
  const sortBy = query?.sortBy ?? DEFAULT_SORT_BY;
  const sortDirection = query?.sortDirection ?? DEFAULT_SORT_DIRECTION;

  return {
    limit,
    page,
    sortBy,
    sortDirection,
    offset: (page - 1) * limit,
  };
}
