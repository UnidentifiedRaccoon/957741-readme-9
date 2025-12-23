import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios from 'axios';
import {
  EmailSubscriberRepository,
  EmailSubscriberFactory,
  EmailSubscriberEntity,
  EMAIL_SUBSCRIBER_EXISTS,
} from '@project/email-subscriber';
import { contentServiceConfig } from '@project/notify-config';
import { MailService, PostInfo } from '@project/mail';
import { CreateSubscriberDto } from '../dto/create-subscriber.dto';

interface PostsResponse {
  entities: PostInfo[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
}

@Injectable()
export class EmailSubscriberApiService {
  private readonly logger = new Logger(EmailSubscriberApiService.name);

  constructor(
    private readonly emailSubscriberRepository: EmailSubscriberRepository,
    private readonly emailSubscriberFactory: EmailSubscriberFactory,
    private readonly mailService: MailService,
    @Inject(contentServiceConfig.KEY)
    private readonly contentConfig: ConfigType<typeof contentServiceConfig>,
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

    return this.emailSubscriberRepository.save(subscriberEntity);
  }

  public async getSubscriberByEmail(email: string): Promise<EmailSubscriberEntity | null> {
    return this.emailSubscriberRepository.findByEmail(email);
  }

  public async sendNewPostsNotifications(): Promise<{ sentCount: number; postsCount: number }> {
    const subscribers = await this.emailSubscriberRepository.findAll();
    this.logger.log(`Found ${subscribers.length} subscribers`);

    if (subscribers.length === 0) {
      return { sentCount: 0, postsCount: 0 };
    }

    let sentCount = 0;
    let totalPostsCount = 0;

    for (const subscriber of subscribers) {
      try {
        const posts = await this.getNewPostsForSubscriber(subscriber);

        if (posts.length > 0) {
          await this.mailService.sendNewPostsNotification(subscriber.toPOJO(), posts);
          await this.emailSubscriberRepository.updateLastSentAt(subscriber.id, new Date());
          sentCount++;
          totalPostsCount += posts.length;
          this.logger.log(`Sent notification to ${subscriber.email} with ${posts.length} posts`);
        }
      } catch (error) {
        this.logger.error(`Failed to send notification to ${subscriber.email}:`, error);
      }
    }

    return { sentCount, postsCount: totalPostsCount };
  }

  private async getNewPostsForSubscriber(subscriber: EmailSubscriberEntity): Promise<PostInfo[]> {
    try {
      const url = `${this.contentConfig.url}/api/posts`;
      const response = await axios.get<PostsResponse>(url, {
        params: {
          limit: 50,
          sortBy: 'publishedAt',
          sortDirection: 'desc',
        },
      });

      const posts = response.data.entities || [];

      // Фильтруем публикации, которые были созданы после последней рассылки
      if (subscriber.lastSentAt) {
        return posts.filter(
          (post) => new Date(post.publishedAt) > new Date(subscriber.lastSentAt),
        );
      }

      return posts;
    } catch (error) {
      this.logger.error('Failed to fetch posts from content service:', error);
      return [];
    }
  }
}

