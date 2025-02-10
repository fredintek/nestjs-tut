import {
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTagsDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @MaxLength(256)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'slug must be all lowercase and words must be seperated with hyphens',
  })
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsJSON()
  @IsOptional()
  schema?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  featuredImageUrl?: string;
}
