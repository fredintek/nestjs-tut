import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Users } from '../users.entity';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly datasource: DataSource) {}

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    let newUsers: Users[] = [];

    // create a query runner instance
    const queryRunner = this.datasource.createQueryRunner();
    try {
      // connect query runner to datasource
      await queryRunner.connect();

      // start transaction
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException('Could not connect to database');
    }

    try {
      // if successful commit
      for (let user of createManyUsersDto.users) {
        let newUser = queryRunner.manager.create(Users, user);
        let result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      // if unsuccessful rollback transaction
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not complete transaction', {
        description: String(error),
      });
    } finally {
      try {
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException(
          'Could not release connection transaction',
          { description: String(error) },
        );
      }
      // release connection
    }

    return {
      message: 'Users created successfully',
      users: newUsers,
    };
  }
}
