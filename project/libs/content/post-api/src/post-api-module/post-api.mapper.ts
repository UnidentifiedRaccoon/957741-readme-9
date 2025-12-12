import { PostEntity } from '@project/content-post';
import { PostRdo } from '../rdo/post.rdo';
import { fillDto } from '@project/helpers';

export function postToRdo(post: PostEntity): PostRdo {
  return fillDto(PostRdo, post.toPOJO());
}

export function postsToRdo(posts: PostEntity[]): PostRdo[] {
  return posts.map(postToRdo);
}

