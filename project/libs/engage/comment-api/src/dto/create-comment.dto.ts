import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment text (10-300 characters)',
    example: 'This is a great post! Thank you for sharing.',
  })
  public text: string;
}

