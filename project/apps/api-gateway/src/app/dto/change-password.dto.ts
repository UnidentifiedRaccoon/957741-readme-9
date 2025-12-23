import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: '123456',
  })
  @IsString()
  public currentPassword: string;

  @ApiProperty({
    description: 'New password (6-12 characters)',
    example: 'newpass123',
    minLength: 6,
    maxLength: 12,
  })
  @IsString()
  @Length(6, 12, { message: 'Password must be between 6 and 12 characters' })
  public newPassword: string;
}


