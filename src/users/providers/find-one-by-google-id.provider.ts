import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneByGoogleIdProvider {
  constructor(
    /**
     * Injecting the user repository
     */
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  public async findOneByGoogleId(googleId: string) {
    return await this.userRepository.findOne({ where: { googleId } });
  }
}
