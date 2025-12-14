import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsISO8601, IsString, Length } from 'class-validator';
import { AuthenticationValidateMessage } from '../authentication-module/authentication.constant';

export class CreateUserDto {
  @ApiProperty({
    description: 'User unique email',
    example: 'user@user.local',
  })
  @IsEmail({}, { message: AuthenticationValidateMessage.EmailNotValid })
  public email: string;

  @ApiProperty({
    description: 'User date birth',
    example: '1981-03-12',
  })
  @IsISO8601({}, { message: AuthenticationValidateMessage.DateBirthNotValid })
  public dateBirth: string;

  @ApiProperty({
    description: 'User first name (3-50 characters)',
    example: 'Keks',
  })
  @IsString()
  @Length(3, 50, { message: 'First name must be between 3 and 50 characters' })
  public firstname: string;

  @ApiProperty({
    description: 'User last name (3-50 characters)',
    example: 'Ivanov',
  })
  @IsString()
  @Length(3, 50, { message: 'Last name must be between 3 and 50 characters' })
  public lastname: string;

  @ApiProperty({
    description: 'User password (6-12 characters)',
    example: '123456',
  })
  @IsString()
  @Length(6, 12, { message: 'Password must be between 6 and 12 characters' })
  public password: string;
}
