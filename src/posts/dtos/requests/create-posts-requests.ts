import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { MetaOptionsType } from 'src/meta-options/dtos/create-posts-meta-options.dto';

export enum postTypeEnum {
  POST = 'post',
  PAGE = 'page',
  STORY = 'story',
  SERIES = 'series',
}

export enum statusEnum {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  SCHEDULED = 'scheduled',
  REVIEW = 'review',
}

export class CreatePostDto {
  @ApiProperty({
    description: 'This is the title for the blog posts',
    example: 'My First Post',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(512)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Possible values, "post", "page", "story", "series"',
    example: 'post',
    enum: postTypeEnum,
  })
  @IsNotEmpty()
  @IsEnum(postTypeEnum)
  postType: postTypeEnum;

  @ApiProperty({
    description: 'For example - "my-url"',
    example: 'my-first-post',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'slug must be all lowercase and words must be seperated with hyphens',
  })
  slug: string;

  @ApiProperty({
    description: 'Possible values, "draft", "schedule", "review", "published"',
    example: 'draft',
    enum: statusEnum,
  })
  @IsNotEmpty()
  @IsEnum(statusEnum)
  status: statusEnum;

  @ApiPropertyOptional({
    description: 'This is the content of the blog post',
    example: 'My First Post Content',
  })
  @IsOptional()
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'Serializes your JSON object else an error is returned',
  })
  @IsOptional()
  @IsJSON()
  schema: string;

  @ApiPropertyOptional({
    description: 'Featured image for your blog post',
    example: 'http://localhost.com/images/image1.jpg',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImageUrl: string;

  @ApiProperty({
    description: 'Date of when the post was published',
    example: '2022-01-01T00:00:00Z',
  })
  @IsISO8601()
  @IsOptional()
  publishOn: Date;

  @ApiProperty({
    description: 'Array of tags for your blog post',
    example: ['tag1', 'tag2', 'tag3'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags: string[];

  @ApiPropertyOptional({
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        metavalue: {
          type: 'json',
          description: 'The metavalue is a JSON string',
          example: '{"sidebarEnabled": true, "footerActive": true}',
        },
      },
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MetaOptionsType)
  metaOptions: MetaOptionsType | undefined;
}
