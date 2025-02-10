import { IsJSON, IsNotEmpty } from 'class-validator';

export class MetaOptionsType {
  @IsNotEmpty()
  @IsJSON()
  metavalue: string;
}
