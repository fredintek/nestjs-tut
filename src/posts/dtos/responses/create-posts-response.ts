import { ApiProperty } from '@nestjs/swagger';
import { CreatePostDto } from '../requests/create-posts-requests';

export class CreatePostsResponse {
  @ApiProperty({ example: 201 })
  status: number;

  @ApiProperty({ example: 'Post created successfully' })
  message: string;

  @ApiProperty({ type: CreatePostDto })
  data: CreatePostDto;
}
