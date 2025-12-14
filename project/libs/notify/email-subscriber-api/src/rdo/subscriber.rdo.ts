import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SubscriberRdo {
  @ApiProperty({
    description: 'Subscriber unique ID',
    example: '507f1f77bcf86cd799439011',
  })
  @Expose()
  public id: string;

  @ApiProperty({
    description: 'Subscriber email address',
    example: 'user@example.com',
  })
  @Expose()
  public email: string;

  @ApiProperty({
    description: 'Subscriber first name',
    example: 'John',
  })
  @Expose()
  public firstname: string;

  @ApiProperty({
    description: 'Subscriber last name',
    example: 'Doe',
  })
  @Expose()
  public lastname: string;
}

