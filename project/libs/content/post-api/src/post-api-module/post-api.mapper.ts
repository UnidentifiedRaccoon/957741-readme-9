import { PostEntity } from '@project/content-post';
import { PostRdo } from '../rdo/post.rdo';
import { fillDto } from '@project/helpers';

type PlainObject = Record<string, unknown>;

export function postToRdo(post: PostEntity): PostRdo {
  return fillDto(PostRdo, post.toPOJO() as unknown as PlainObject);
}

export function postsToRdo(posts: PostEntity[]): PostRdo[] {
  return posts.map(postToRdo);
}

