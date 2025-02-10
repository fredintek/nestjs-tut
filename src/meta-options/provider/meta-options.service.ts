import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MetaOptions } from '../metaOptions.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOptionsType } from '../dtos/create-posts-meta-options.dto';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOptions)
    private readonly metaOptionsRepository: Repository<MetaOptions>,
  ) {}

  public async createMetaOptions(createPostMetaOptionsDto: MetaOptionsType) {
    let metaOption = this.metaOptionsRepository.create(
      createPostMetaOptionsDto,
    );

    return await this.metaOptionsRepository.save(metaOption);
  }
}
