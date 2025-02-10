import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { Posts } from '../posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dtos/requests/create-posts-requests';
import { MetaOptions } from 'src/meta-options/metaOptions.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly userService: UsersService,

    /**
     * Post repository injection
     */
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,

    /**
     * Metaoptions repository injection
     */
    @InjectRepository(MetaOptions)
    private metaOptionsRepository: Repository<MetaOptions>,
  ) {}

  public findAllUserPosts(userId: number) {
    const user = this.userService.findOneUser({ id: userId });

    return [
      {
        id: 1,
        title: 'Post 1',
        content: 'Content 1',
      },
      {
        id: 2,
        title: 'Post 2',
        content: 'Content 2',
      },
    ];
  }

  /**
   * Create new post method
   */

  public async create(@Body() createPostDto: CreatePostDto) {
    // create metaoptions
    let metaOptions = createPostDto?.metaOptions
      ? this.metaOptionsRepository.create(createPostDto.metaOptions)
      : null;

    if (metaOptions) {
      await this.metaOptionsRepository.save(metaOptions);
    }

    // create post
    let post = this.postsRepository.create(createPostDto);

    // add metaoptions to the post
    if (metaOptions) {
      post.metaOptions = metaOptions;
    }

    // return post
    return await this.postsRepository.save(post);
  }
}
