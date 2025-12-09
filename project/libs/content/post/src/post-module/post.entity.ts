import { Entity, StorableEntity, Post, PostType, PostStatus, Tag } from '@project/core';

export class PostEntity extends Entity implements StorableEntity<Post> {
  public type: PostType;
  public status: PostStatus;
  public userId: string;
  public title?: string;
  public extraFields?: Record<string, unknown>;
  public isRepost: boolean;
  public originalPostId?: string;
  public originalUserId?: string;
  public createdAt?: Date;
  public publishedAt?: Date;
  public tags?: Tag[];

  constructor(post?: Post) {
    super();
    this.populate(post);
  }

  public populate(post?: Post): void {
    if (!post) {
      return;
    }

    this.id = post.id ?? '';
    this.type = post.type;
    this.status = post.status;
    this.userId = post.userId;
    this.title = post.title;
    this.extraFields = post.extraFields;
    this.isRepost = post.isRepost ?? false;
    this.originalPostId = post.originalPostId;
    this.originalUserId = post.originalUserId;
    this.createdAt = post.createdAt;
    this.publishedAt = post.publishedAt;
    this.tags = post.tags;
  }

  public toPOJO(): Post {
    return {
      id: this.id,
      type: this.type,
      status: this.status,
      userId: this.userId,
      title: this.title,
      extraFields: this.extraFields,
      isRepost: this.isRepost,
      originalPostId: this.originalPostId,
      originalUserId: this.originalUserId,
      createdAt: this.createdAt,
      publishedAt: this.publishedAt,
      tags: this.tags,
    };
  }
}

