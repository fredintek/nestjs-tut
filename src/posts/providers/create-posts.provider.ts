import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/requests/create-posts-requests';
import { Repository } from 'typeorm';
import { Posts } from '../posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { ActiveUserInterface } from 'src/auth/interfaces/active-user.interface';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class CreatePostsProvider {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,

    private readonly tagsService: TagsService,

    private readonly userService: UsersService,
  ) {}

  public async create(
    createPostDto: CreatePostDto,
    activeUser: ActiveUserInterface,
  ) {
    // find author from database based on authorId
    let author =
      (await this.userService.findOneUser(activeUser.sub)) || undefined;

    let tags = await this.tagsService.findMultipleTags(createPostDto.tags);

    let post = this.postsRepository.create({ ...createPostDto, author, tags });

    // return post
    return await this.postsRepository.save(post);
  }
}
