import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamsDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { Users } from '../users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  public findAllUsers(limit: number, page: number) {
    return [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
      {
        id: 2,
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
      },
    ];
  }

  public findOneUser(getUsersParamsDto: GetUsersParamsDto) {
    return {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
    };
  }

  public async createUser(createUserDto: CreateUserDto) {
    // check if user already exists

    const foundUser = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    // handle exception

    // create a new user
    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);

    return newUser;
  }
}
