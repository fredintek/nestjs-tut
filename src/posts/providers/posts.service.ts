import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { Posts } from '../posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dtos/requests/create-posts-requests';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/requests/patch-posts-requests';
import { Tags } from 'src/tags/tags.entity';
import { GetPostsDto } from '../dtos/requests/get-posts-base.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';

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

    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async findAllPosts(postQuery: GetPostsDto): Promise<Paginated<Posts>> {
    let posts = await this.paginationProvider.paginateQuery<Posts>(
      { limit: postQuery.limit, page: postQuery.page },
      this.postsRepository,
    );
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
    try {
      // Find the post
      const post = await this.postsRepository.findOne({
        where: {
          id: patchPostDto.id,
        },
        relations: ['tags'],
      });

      if (!post) return new NotFoundException('No posts found').getResponse();

      let newTags: Tags[] | undefined;

      if ((patchPostDto.tags?.length as number) > 0) {
        // Find tags in a single query
        newTags = await this.tagsService.findMultipleTags(
          patchPostDto.tags as number[],
        );

        if (newTags.length !== patchPostDto.tags?.length)
          return new BadRequestException('Invalid tag detected');
      } else {
        newTags = post.tags;
      }

      // Update only the fields provided in patchPostDto
      Object.assign(post, {
        title: patchPostDto.title ?? post.title,
        postType: patchPostDto.postType ?? post.postType,
        slug: patchPostDto.slug ?? post.slug,
        status: patchPostDto.status ?? post.status,
        content: patchPostDto.content ?? post.content,
        schema: patchPostDto.schema ?? post.schema,
        featuredImageUrl:
          patchPostDto.featuredImageUrl ?? post.featuredImageUrl,
        publishOn: patchPostDto.publishOn ?? post.publishOn,
        tags: newTags ?? post.tags,
      });

      // Save and return the updated post
      return await this.postsRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later',
        { description: 'Error connecting to the database' },
      );
    }
  }
}
