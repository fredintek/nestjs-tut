import {
  Body,
  Controller,
  Delete,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TagsService } from './providers/tags.service';
import { CreateTagsDto } from './dtos/create-tags.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  public async create(@Body() createTagDto: CreateTagsDto) {
    return await this.tagsService.create(createTagDto);
  }

  @Delete()
  public async delete(@Query('id', ParseIntPipe) id: number) {
    return await this.tagsService.delete(id);
  }

  @Delete('soft-delete')
  public async deleteSoft(@Query('id', ParseIntPipe) id: number) {
    return await this.tagsService.softRemove(id);
  }
}
