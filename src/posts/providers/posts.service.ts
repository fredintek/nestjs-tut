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

  public async findAllUserPosts(userId: number) {
    const user = this.userService.findOneUser(userId);

    let posts = await this.postsRepository.find();

    return posts;
  }

  /**
   * Create new post method
   */
  public async create(createPostDto: CreatePostDto) {
    // find author from database based on authorId
    let author = await this.userService.findOneUser(createPostDto.authorId);
    console.log('author', author);

    let post: Posts;
    // create post
    if (author) {
      post = this.postsRepository.create({ ...createPostDto, author });
    } else {
      post = this.postsRepository.create({ ...createPostDto });
    }

    // return post
    return await this.postsRepository.save(post);
  }

  public async deletePost(postId: number) {
    // delete the post
    await this.postsRepository.delete(postId);

    // confirmation
    return {
      message: 'Post deleted successfully',
      postId,
    };
  }
}
