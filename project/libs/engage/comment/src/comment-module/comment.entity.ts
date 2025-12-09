import { Entity, StorableEntity, Comment } from '@project/core';

export class CommentEntity extends Entity implements StorableEntity<Comment> {
  public postId: string;
  public userId: string;
  public text: string;
  public createdAt?: Date;

  constructor(comment?: Comment) {
    super();
    this.populate(comment);
  }

  public populate(comment?: Comment): void {
    if (!comment) {
      return;
    }

    this.id = comment.id ?? '';
    this.postId = comment.postId;
    this.userId = comment.userId;
    this.text = comment.text;
    this.createdAt = comment.createdAt;
  }

  public toPOJO(): Comment {
    return {
      id: this.id,
      postId: this.postId,
      userId: this.userId,
      text: this.text,
      createdAt: this.createdAt,
    };
  }
}

