import { Injectable, Logger } from '@nestjs/common';
import { LikeRepository } from '@project/engage-like';

@Injectable()
export class LikeApiService {
  private readonly logger = new Logger(LikeApiService.name);

  constructor(private readonly likeRepository: LikeRepository) {}

  public async toggleLike(postId: string, userId: string): Promise<{ liked: boolean }> {
    return this.likeRepository.toggleLike(postId, userId);
  }

  public async countLikes(postId: string): Promise<number> {
    return this.likeRepository.countByPostId(postId);
  }

  public async isLiked(postId: string, userId: string): Promise<boolean> {
    return this.likeRepository.existsByPostAndUser(postId, userId);
  }

  public async deletePostLikes(postId: string): Promise<number> {
    return this.likeRepository.deleteByPostId(postId);
  }
}
