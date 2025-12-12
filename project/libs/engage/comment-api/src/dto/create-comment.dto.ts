import { ApiProperty } from '@nestjs/swagger';
import { CommentValidateMessage } from '../comment-api-module/comment-api.constant';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment text (10-300 characters)',
    example: 'This is a great post! Thank you for sharing.',
  })
  @IsString()
  @IsNotEmpty({ message: CommentValidateMessage.TextIsEmpty })
  public text: string;
}

