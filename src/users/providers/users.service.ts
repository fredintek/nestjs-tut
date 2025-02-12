import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { Users } from '../users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @InjectRepository(Users)
    private usersRepository: Repository<Users>,

    private readonly configService: ConfigService,

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
  ) {}

  public findAllUsers(limit: number, page: number) {
    console.log('APIKEY', this.profileConfiguration.apiKey);
    console.log('NORMAL', this.configService.get('database.port'));
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

  public async findOneUser(id: number) {
    return await this.usersRepository.findOneBy({ id });
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
