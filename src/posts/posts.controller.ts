import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './providers/posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get('/:userId')
  public getAllPosts(@Param('userId', ParseIntPipe) userId: number) {
    return this.postService.findAllUserPosts(userId);
  }
}
