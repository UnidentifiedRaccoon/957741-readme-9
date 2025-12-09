import { Injectable } from '@nestjs/common';
import { EntityFactory, Tag } from '@project/core';
import { TagEntity } from './tag.entity';

@Injectable()
export class TagFactory implements EntityFactory<TagEntity> {
  public create(entityPlainData: Tag): TagEntity {
    return new TagEntity(entityPlainData);
  }
}

