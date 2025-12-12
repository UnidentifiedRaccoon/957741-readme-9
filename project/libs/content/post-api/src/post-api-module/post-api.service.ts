import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { PostRepository, PostEntity, PostQuery, PostFilter, PostFactory } from '@project/content-post';
import { PostStatus, PaginationResult } from '@project/core';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { POST_NOT_OWNER, REPOST_ALREADY_EXISTS, CANNOT_REPOST_OWN } from './post-api.constant';

function normalizeTags(tags?: string[]): { name: string }[] | undefined {
  return tags?.map((name) => ({ name: name.toLowerCase() }));
}

@Injectable()
export class PostApiService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postFactory: PostFactory,
  ) {}

  private assertOwnership(post: PostEntity, userId: string): void {
    if (post.userId !== userId) {
      throw new ForbiddenException(POST_NOT_OWNER);
    }
  }

  public async createPost(dto: CreatePostDto, userId: string): Promise<PostEntity> {
    const postEntity = this.postFactory.create({
      type: dto.type,
      status: PostStatus.PUBLISHED,
      userId,
      title: dto.title,
      extraFields: dto.extraFields,
      isRepost: false,
      tags: normalizeTags(dto.tags),
    });

    return this.postRepository.save(postEntity);
  }

  public async getPost(id: string): Promise<PostEntity> {
    return this.postRepository.findById(id);
  }

  public async updatePost(id: string, dto: UpdatePostDto, userId: string): Promise<PostEntity> {
    const post = await this.getPost(id);
    this.assertOwnership(post, userId);

    let hasChanges = false;

    if (dto.title !== undefined && dto.title !== post.title) {
      post.title = dto.title;
      hasChanges = true;
    }

    if (dto.status !== undefined && dto.status !== post.status) {
      post.status = dto.status;
      if (dto.status === PostStatus.PUBLISHED) {
        post.publishedAt = new Date();
      }
      hasChanges = true;
    }

    if (dto.extraFields !== undefined) {
      const currentJson = JSON.stringify(post.extraFields);
      const newJson = JSON.stringify(dto.extraFields);
      if (currentJson !== newJson) {
        post.extraFields = dto.extraFields;
        hasChanges = true;
      }
    }

    if (dto.tags !== undefined) {
      const normalizedTags = normalizeTags(dto.tags);
      const currentTagNames = post.tags?.map((t) => t.name).sort() ?? [];
      const newTagNames = normalizedTags?.map((t) => t.name).sort() ?? [];
      if (JSON.stringify(currentTagNames) !== JSON.stringify(newTagNames)) {
        post.tags = normalizedTags;
        hasChanges = true;
      }
    }

    if (!hasChanges) {
      return post;
    }

    return this.postRepository.update(post);
  }

  public async deletePost(id: string, userId: string): Promise<void> {
    const post = await this.getPost(id);
    this.assertOwnership(post, userId);
    await this.postRepository.deleteById(id);
  }

  public async getPublishedPosts(filter?: PostFilter, query?: PostQuery): Promise<PaginationResult<PostEntity>> {
    return this.postRepository.findPublished(filter, query);
  }

  public async getUserPosts(userId: string, query?: PostQuery): Promise<PaginationResult<PostEntity>> {
    return this.postRepository.findByUserId(userId, query);
  }

  public async getUserDrafts(userId: string): Promise<PostEntity[]> {
    return this.postRepository.findDraftsByUserId(userId);
  }

  public async getFeed(userIds: string[], query?: PostQuery): Promise<PaginationResult<PostEntity>> {
    return this.postRepository.findByUserIds(userIds, query);
  }

  public async searchByTitle(searchQuery: string, limit?: number): Promise<PostEntity[]> {
    return this.postRepository.searchByTitle(searchQuery, limit);
  }

  public async createRepost(originalPostId: string, userId: string): Promise<PostEntity> {
    const originalPost = await this.getPost(originalPostId);

    if (originalPost.userId === userId) {
      throw new ForbiddenException(CANNOT_REPOST_OWN);
    }

    const repostExists = await this.postRepository.existsRepost(originalPostId, userId);
    if (repostExists) {
      throw new ConflictException(REPOST_ALREADY_EXISTS);
    }

    const repostEntity = this.postFactory.create({
      type: originalPost.type,
      status: PostStatus.PUBLISHED,
      userId,
      title: originalPost.title,
      extraFields: originalPost.extraFields,
      isRepost: true,
      originalPostId,
      originalUserId: originalPost.userId,
      tags: originalPost.tags,
    });

    return this.postRepository.save(repostEntity);
  }

  public async countUserPosts(userId: string): Promise<number> {
    return this.postRepository.countByUserId(userId);
  }
}
