import { PostStatus, PostType } from '@project/core';

export interface PostFilter {
  userId?: string;
  type?: PostType;
  status?: PostStatus;
  tag?: string;
}

export interface PrismaPostWhereInput {
  status?: PostStatus;
  userId?: string | { in: string[] };
  type?: PostType;
  tags?: { some: { name: string } };
  title?: { contains: string; mode: 'insensitive' };
  originalPostId?: string;
  isRepost?: boolean;
}

export function postFilterToPrismaFilter(
  filter?: PostFilter,
  baseStatus: PostStatus = PostStatus.PUBLISHED
): PrismaPostWhereInput {
  const where: PrismaPostWhereInput = {
    status: baseStatus,
  };

  if (!filter) {
    return where;
  }

  if (filter.userId) {
    where.userId = filter.userId;
  }

  if (filter.type) {
    where.type = filter.type;
  }

  if (filter.tag) {
    where.tags = {
      some: { name: filter.tag },
    };
  }

  return where;
}

