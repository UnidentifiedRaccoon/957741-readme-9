import { ConflictException, Injectable, Logger } from '@nestjs/common';
import {
  EmailSubscriberRepository,
  EmailSubscriberFactory,
  EmailSubscriberEntity,
  EMAIL_SUBSCRIBER_EXISTS,
} from '@project/email-subscriber';
import { CreateSubscriberDto } from '../dto/create-subscriber.dto';

@Injectable()
export class EmailSubscriberApiService {
  private readonly logger = new Logger(EmailSubscriberApiService.name);

  constructor(
    private readonly emailSubscriberRepository: EmailSubscriberRepository,
    private readonly emailSubscriberFactory: EmailSubscriberFactory,
  ) {}

  public async addSubscriber(dto: CreateSubscriberDto): Promise<EmailSubscriberEntity> {
    const { email } = dto;
    const existingSubscriber = await this.emailSubscriberRepository.findByEmail(email);

    if (existingSubscriber) {
      throw new ConflictException(EMAIL_SUBSCRIBER_EXISTS);
    }

    const subscriberEntity = this.emailSubscriberFactory.create({
      email: dto.email,
      firstname: dto.firstname,
      lastname: dto.lastname,
    });

    this.logger.log(`Creating new subscriber: ${email}`);
    await this.emailSubscriberRepository.save(subscriberEntity);
    return subscriberEntity;
  }

  public async getSubscriberByEmail(email: string): Promise<EmailSubscriberEntity | null> {
    return this.emailSubscriberRepository.findByEmail(email);
  }
}

