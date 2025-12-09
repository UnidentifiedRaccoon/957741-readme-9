import { PostType } from './post-type.enum';
import { PostStatus } from './post-status.enum';
import { Tag } from './tag.interface';

export interface Post {
  id?: string;
  type: PostType;
  status: PostStatus;
  userId: string;
  title?: string;
  extraFields?: Record<string, unknown>;
  isRepost: boolean;
  originalPostId?: string;
  originalUserId?: string;
  createdAt?: Date;
  publishedAt?: Date;
  tags?: Tag[];
}
