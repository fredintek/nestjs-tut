import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { Posts } from '../posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dtos/requests/create-posts-requests';
import { MetaOptions } from 'src/meta-options/metaOptions.entity';
import { Users } from 'src/users/users.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/requests/patch-posts-requests';

@Injectable()
export class PostsService {
  constructor(
    private readonly userService: UsersService,

    private readonly tagsService: TagsService,

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

    let posts = await this.postsRepository.find({ relations: { tags: true } });

    return posts;
  }

  /**
   * Create new post method
   */
  public async create(createPostDto: CreatePostDto) {
    // find author from database based on authorId
    let author =
      (await this.userService.findOneUser(createPostDto.authorId)) || undefined;

    let tags = await this.tagsService.findMultipleTags(createPostDto.tags);

    let post = this.postsRepository.create({ ...createPostDto, author, tags });

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

  public async updatePost(patchPostDto: PatchPostDto) {
    // find the tags
    let tags = await this.tagsService.findMultipleTags(
      patchPostDto.tags as number[],
    );

    // find the post
    let posts = await this.postsRepository.findOneBy({
      id: patchPostDto.id,
    });

    if (posts) {
      // update the properties of the post
      posts.title = patchPostDto.title ?? posts?.title;
      posts.postType = patchPostDto.postType ?? posts?.postType;
      posts.slug = patchPostDto.slug ?? posts?.slug;
      posts.status = patchPostDto.status ?? posts?.status;
      posts.content = patchPostDto.content ?? posts?.content;
      posts.schema = patchPostDto.schema ?? posts?.schema;
      posts.featuredImageUrl =
        patchPostDto.featuredImageUrl ?? posts?.featuredImageUrl;
      posts.publishOn = patchPostDto.publishOn ?? posts?.publishOn;

      // assign new tags
      posts.tags = tags;

      // save the post and return
      return await this.postsRepository.save(posts);
    } else {
      throw new Error('Post not found');
    }
  }
}
