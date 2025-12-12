import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository, CommentEntity, CommentQuery, CommentFactory } from '@project/engage-comment';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { COMMENT_NOT_FOUND, COMMENT_NOT_OWNER } from './comment-api.constant';

@Injectable()
export class CommentApiService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly commentFactory: CommentFactory,
  ) {}

  public async createComment(
    postId: string,
    dto: CreateCommentDto,
    userId: string,
  ): Promise<CommentEntity> {
    const commentEntity = this.commentFactory.create({
      postId,
      userId,
      text: dto.text,
    });

    return this.commentRepository.save(commentEntity);
  }

  public async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      throw new NotFoundException(COMMENT_NOT_FOUND);
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException(COMMENT_NOT_OWNER);
    }

    await this.commentRepository.deleteById(commentId);
  }

  public async getPostComments(postId: string, query?: CommentQuery): Promise<CommentEntity[]> {
    return this.commentRepository.findByPostId(postId, query);
  }

  public async countPostComments(postId: string): Promise<number> {
    return this.commentRepository.countByPostId(postId);
  }

  public async deletePostComments(postId: string): Promise<number> {
    return this.commentRepository.deleteByPostId(postId);
  }
}

