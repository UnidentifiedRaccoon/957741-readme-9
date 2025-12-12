import { PostEntity } from '@project/content-post';
import { PaginationResult } from '@project/core';
import { PostRdo } from '../rdo/post.rdo';
import { PostWithPaginationRdo } from '../rdo/post-with-pagination.rdo';
import { fillDto } from '@project/helpers';

export function postToRdo(post: PostEntity): PostRdo {
  return fillDto(PostRdo, post.toPOJO());
}

export function postsToRdo(posts: PostEntity[]): PostRdo[] {
  return posts.map(postToRdo);
}

export function paginationToRdo(result: PaginationResult<PostEntity>): PostWithPaginationRdo {
  return {
    entities: result.entities.map(postToRdo),
    totalPages: result.totalPages,
    totalItems: result.totalItems,
    currentPage: result.currentPage,
    itemsPerPage: result.itemsPerPage,
  };
}

