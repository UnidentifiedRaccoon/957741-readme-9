import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @ApiProperty({
    description: 'Subscriber email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty({
    description: 'Subscriber first name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  public firstname: string;

  @ApiProperty({
    description: 'Subscriber last name',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  public lastname: string;
}

