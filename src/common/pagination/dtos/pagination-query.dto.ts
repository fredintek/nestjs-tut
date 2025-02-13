import { IsInt, IsOptional, IsPositive, Max } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @IsPositive()
  @IsInt()
  page?: number = 1;
}
