import { Entity, StorableEntity, Tag } from '@project/core';

export class TagEntity extends Entity implements StorableEntity<Tag> {
  public name: string;

  constructor(tag?: Tag) {
    super();
    this.populate(tag);
  }

  public populate(tag?: Tag): void {
    if (!tag) {
      return;
    }

    this.id = tag.id ?? '';
    this.name = tag.name;
  }

  public toPOJO(): Tag {
    return {
      id: this.id,
      name: this.name,
    };
  }
}

