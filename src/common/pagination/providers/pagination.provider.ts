import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class PaginationProvider {
  public async paginateQuery<T extends ObjectLiteral>(
    paginateQuery: PaginationQueryDto,
    repository: Repository<T>,
    options?: FindManyOptions<T>,
  ) {
    let results = await repository.find({
      ...options,
      skip:
        (paginateQuery.limit as number) * ((paginateQuery.page as number) - 1),
      take: paginateQuery.limit,
    });

    return results;
  }
}
