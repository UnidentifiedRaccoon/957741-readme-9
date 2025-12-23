import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment text (10-300 characters)',
    example: 'This is a great post! Thank you for sharing.',
    minLength: 10,
    maxLength: 300,
  })
  @IsString()
  @Length(10, 300, { message: 'Comment must be between 10 and 300 characters' })
  public text: string;
}


