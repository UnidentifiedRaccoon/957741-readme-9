import { DEFAULT_COMMENT_COUNT_LIMIT, DEFAULT_PAGE } from './comment.constant';

export interface CommentQuery {
  limit?: number;
  page?: number;
}

export interface NormalizedCommentQuery {
  limit: number;
  page: number;
  offset: number;
}

export function normalizeCommentQuery(query?: CommentQuery): NormalizedCommentQuery {
  const limit = query?.limit ?? DEFAULT_COMMENT_COUNT_LIMIT;
  const page = query?.page ?? DEFAULT_PAGE;

  return {
    limit,
    page,
    offset: (page - 1) * limit,
  };
}

