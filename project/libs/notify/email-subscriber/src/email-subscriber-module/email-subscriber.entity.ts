import { Entity, StorableEntity, Subscriber } from '@project/core';

export class EmailSubscriberEntity extends Entity implements StorableEntity<Subscriber> {
  public email: string;
  public firstname: string;
  public lastname: string;
  public lastSentAt?: Date;

  constructor(subscriber?: Subscriber) {
    super();
    this.populate(subscriber);
  }

  public populate(subscriber?: Subscriber): void {
    if (!subscriber) {
      return;
    }

    this.id = subscriber.id ?? '';
    this.email = subscriber.email;
    this.firstname = subscriber.firstname;
    this.lastname = subscriber.lastname;
    this.lastSentAt = subscriber.lastSentAt;
  }

  public toPOJO(): Subscriber {
    return {
      id: this.id,
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      lastSentAt: this.lastSentAt,
    };
  }
}

