import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { SubscriptionRepository } from '@project/engage-subscription';
import { CANNOT_SUBSCRIBE_SELF } from './subscription-api.constant';

@Injectable()
export class SubscriptionApiService {
  private readonly logger = new Logger(SubscriptionApiService.name);

  constructor(private readonly subscriptionRepository: SubscriptionRepository) {}

  public async subscribe(
    followerId: string,
    followingId: string,
  ): Promise<{ subscribed: boolean }> {
    if (followerId === followingId) {
      throw new BadRequestException(CANNOT_SUBSCRIBE_SELF);
    }

    return this.subscriptionRepository.subscribe(followerId, followingId);
  }

  public async unsubscribe(
    followerId: string,
    followingId: string,
  ): Promise<{ subscribed: boolean }> {
    return this.subscriptionRepository.unsubscribe(followerId, followingId);
  }

  public async getFollowingIds(followerId: string): Promise<string[]> {
    return this.subscriptionRepository.getFollowingIds(followerId);
  }

  public async getFollowerIds(followingId: string): Promise<string[]> {
    return this.subscriptionRepository.getFollowerIds(followingId);
  }

  public async countFollowers(userId: string): Promise<number> {
    return this.subscriptionRepository.countFollowers(userId);
  }

  public async countFollowing(userId: string): Promise<number> {
    return this.subscriptionRepository.countFollowing(userId);
  }

  public async isSubscribed(followerId: string, followingId: string): Promise<boolean> {
    return this.subscriptionRepository.isSubscribed(followerId, followingId);
  }
}
