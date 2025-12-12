import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class FollowerIdQueryDto {
  @ApiProperty({
    description: 'Follower User ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId({ message: 'followerId must be a valid MongoDB ObjectId' })
  public followerId: string;
}
