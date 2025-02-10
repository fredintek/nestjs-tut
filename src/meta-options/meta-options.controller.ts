import { Body, Controller, Post } from '@nestjs/common';
import { MetaOptionsService } from './provider/meta-options.service';
import { MetaOptionsType } from './dtos/create-posts-meta-options.dto';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(private readonly metaOptionsService: MetaOptionsService) {}

  @Post()
  public createMetaOptions(@Body() createMetaOptionsDto: MetaOptionsType) {
    console.log('createMetaOptionsDto', createMetaOptionsDto);
    return this.metaOptionsService.createMetaOptions(createMetaOptionsDto);
  }
}
