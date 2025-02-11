import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Tags } from '../tags.entity';
import { CreateTagsDto } from '../dtos/create-tags.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tags) private readonly tagsRepository: Repository<Tags>,
  ) {}

  public async create(createTagDto: CreateTagsDto) {
    let tag = this.tagsRepository.create(createTagDto);
    return await this.tagsRepository.save(tag);
  }

  public async findMultipleTags(tags: number[]) {
    let results = await this.tagsRepository.find({
      where: {
        id: In(tags),
      },
    });
    return results;
  }

  public async delete(id: number) {
    await this.tagsRepository.delete(id);
    return {
      deleted: true,
      message: 'Tag deleted successfully',
      id,
    };
  }

  public async softRemove(id: number) {
    await this.tagsRepository.softDelete(id);
    return {
      deleted: true,
      message: 'Tag deleted successfully',
      id,
    };
  }
}
