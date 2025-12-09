import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TagRdo {
  @ApiProperty({
    description: 'Tag unique ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  public id: string;

  @ApiProperty({
    description: 'Tag name',
    example: 'javascript',
  })
  @Expose()
  public name: string;
}

