import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-posts-requests';
import { IsInt, IsNotEmpty } from 'class-validator';

export class PatchPostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: 'Unique identifier of the post',
    example: 12345,
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  id: number;
}
