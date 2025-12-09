import { Injectable } from '@nestjs/common';
import { EntityFactory, Post } from '@project/core';
import { PostEntity } from './post.entity';

@Injectable()
export class PostFactory implements EntityFactory<PostEntity> {
  public create(entityPlainData: Post): PostEntity {
    return new PostEntity(entityPlainData);
  }
}

