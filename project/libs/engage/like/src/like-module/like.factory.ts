import { Injectable } from '@nestjs/common';
import { EntityFactory, Like } from '@project/core';
import { LikeEntity } from './like.entity';

@Injectable()
export class LikeFactory implements EntityFactory<LikeEntity> {
  public create(entityPlainData: Like): LikeEntity {
    return new LikeEntity(entityPlainData);
  }
}

