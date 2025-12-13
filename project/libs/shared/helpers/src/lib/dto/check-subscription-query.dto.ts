import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CheckSubscriptionQueryDto {
  @ApiProperty({
    description: 'Follower User ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId({ message: 'followerId must be a valid MongoDB ObjectId' })
  public followerId: string;

  @ApiProperty({
    description: 'Following User ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439012',
  })
  @IsMongoId({ message: 'followingId must be a valid MongoDB ObjectId' })
  public followingId: string;
}
