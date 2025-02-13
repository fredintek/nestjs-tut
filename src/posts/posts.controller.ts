import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/requests/create-posts-requests';
import { CreatePostsResponse } from './dtos/responses/create-posts-response';
import { PatchPostDto } from './dtos/requests/patch-posts-requests';
import { GetPostsDto } from './dtos/requests/get-posts-base.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserInterface } from 'src/auth/interfaces/active-user.interface';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get('')
  public getAllPosts(@Query() postQuery: GetPostsDto) {
    // console.log('postQuery', postQuery);
    return this.postService.findAllPosts(postQuery);
  }

  @Post()
  @ApiOperation({
    summary: 'This endpoint creates a new blog post',
  })
  @ApiResponse({
    status: 201,
    description: 'A new post has been created.',
    type: CreatePostsResponse,
  })
  public createPost(
    @Body() createPostDto: CreatePostDto,
    @ActiveUser('email') activeUser: ActiveUserInterface,
  ) {
    console.log('activeUser', activeUser);
    return this.postService.create(createPostDto);
  }

  @Patch()
  @ApiOperation({
    summary: 'This endpoint updates a blog post',
  })
  public updatePost(@Body() patchPostDto: PatchPostDto) {
    return this.postService.updatePost(patchPostDto);
  }

  @Delete()
  @ApiOperation({
    summary: 'This endpoint deletes a blog post',
  })
  public deletePost(@Query('postId', ParseIntPipe) postId: number) {
    return this.postService.deletePost(postId);
  }
}
