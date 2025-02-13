import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
  constructor(
    /**
     * Inject Request Object
     */
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  public async paginateQuery<T extends ObjectLiteral>(
    paginateQuery: PaginationQueryDto,
    repository: Repository<T>,
    options?: FindManyOptions<T> | undefined,
  ): Promise<Paginated<T>> {
    let results = await repository.find({
      skip:
        (paginateQuery.limit as number) * ((paginateQuery.page as number) - 1),
      take: paginateQuery.limit,
      ...options,
    });

    /**
     * Create base url
     */
    const baseUrl = `${this.request.protocol}://${this.request.host}/`;

    const newUrl = new URL(this.request.originalUrl, baseUrl);
    // console.log('NEW URL', newUrl);

    /**
     * Calculating link details
     */
    const currentPage = (paginateQuery.page as number) || 1;
    const limit = (paginateQuery.limit as number) || 10;
    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / limit);
    const nextPage =
      (paginateQuery?.page as number) >= totalPages ? false : true;
    const prevPage = (paginateQuery?.page as number) <= 1 ? false : true;

    if (
      (paginateQuery.page as number) >= totalPages ||
      (paginateQuery.page as number) <= 1
    )
      throw new BadRequestException('Page does not exists');
    /**
     * Final response Object
     */
    const finalResponse: Paginated<T> = {
      data: results,
      metadata: {
        itemsPerPage: limit,
        totalItems: totalItems,
        currentPage: currentPage,
        totalPages: totalPages,
      },
      pagination: {
        firstPage: 1,
        lastPage: totalPages,
        currentPage: currentPage,
        nextPage,
        prevPage,
      },
    };
    return finalResponse;
  }
}
