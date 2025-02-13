import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from '../users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindOneUserByEmailProvider {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  public async findOneUserByEmail(email: string) {
    let user: Users | null;

    try {
      user = await this.userRepository.findOne({
        where: { email },
      });
    } catch (error) {
      throw new RequestTimeoutException('error', {
        description: 'Could not fetch user',
      });
    }

    if (!user) {
      throw new UnauthorizedException('user does not exist');
    }
    return user;
  }
}
