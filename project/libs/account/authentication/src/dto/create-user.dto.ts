import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User unique email',
    example: 'user@user.local',
  })
  public email: string;

  @ApiProperty({
    description: 'User date birth',
    example: '1981-03-12',
  })
  public dateBirth: string;

  @ApiProperty({
    description: 'User first name',
    example: 'Keks',
  })
  public firstname: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Ivanov',
  })
  public lastname: string;

  @ApiProperty({
    description: 'User password',
    example: '123456',
  })
  public password: string;
}
