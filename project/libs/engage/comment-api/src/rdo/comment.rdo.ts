import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CommentRdo {
  @ApiProperty({
    description: 'Comment unique ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  public id: string;

  @ApiProperty({
    description: 'Post ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @Expose()
  public postId: string;

  @ApiProperty({
    description: 'Author user ID',
    example: 'user-uuid-here',
  })
  @Expose()
  public userId: string;

  @ApiProperty({
    description: 'Comment text',
    example: 'This is a great post!',
  })
  @Expose()
  public text: string;

  @ApiProperty({
    description: 'Comment creation date',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Expose()
  public createdAt: Date;
}

