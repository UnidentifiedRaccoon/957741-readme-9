import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'User unique email',
    example: 'user@user.local',
  })
  public email: string;

  @ApiProperty({
    description: 'User password',
    example: '123456',
  })
  public password: string;
}
