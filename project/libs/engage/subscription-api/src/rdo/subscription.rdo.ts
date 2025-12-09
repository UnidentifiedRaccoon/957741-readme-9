import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionRdo {
  @ApiProperty({
    description: 'Subscription unique ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  public id: string;

  @ApiProperty({
    description: 'Follower user ID',
    example: 'follower-uuid-here',
  })
  @Expose()
  public followerId: string;

  @ApiProperty({
    description: 'Following user ID',
    example: 'following-uuid-here',
  })
  @Expose()
  public followingId: string;

  @ApiProperty({
    description: 'Subscription creation date',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Expose()
  public createdAt: Date;
}

