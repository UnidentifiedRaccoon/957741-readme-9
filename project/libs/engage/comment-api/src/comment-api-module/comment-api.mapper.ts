import { CommentEntity } from '@project/engage-comment';
import { CommentRdo } from '../rdo/comment.rdo';
import { fillDto } from '@project/helpers';

export function commentToRdo(comment: CommentEntity): CommentRdo {
  return fillDto(CommentRdo, comment.toPOJO());
}

export function commentsToRdo(comments: CommentEntity[]): CommentRdo[] {
  return comments.map(commentToRdo);
}


