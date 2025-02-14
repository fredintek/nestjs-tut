import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/providers/auth.service';
import { DataSource, Repository } from 'typeorm';
import { Users } from '../users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @InjectRepository(Users)
    private usersRepository: Repository<Users>,

    /**
     * Inject Datasurce
     */
    private readonly datasource: DataSource,

    private readonly userCreateManyProvider: UsersCreateManyProvider,

    private readonly configService: ConfigService,

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

    private readonly createUserProvider: CreateUserProvider,

    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,

    private readonly findOneByGoogleIdProvider: FindOneByGoogleIdProvider,
  ) {}

  public findAllUsers(limit: number, page: number) {
    // console.log('APIKEY', this.profileConfiguration.apiKey);
    // console.log('NORMAL', this.configService.get('database.port'));
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        message: 'The Api endpoint is not supported',
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        description: 'The Api endpoint is not supported',
        cause: new Error(),
      },
    );
  }

  public async findOneUser(id: number) {
    let user: Users | null;
    try {
      user = await this.usersRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try again later',
        { description: 'Error connecting to the database' },
      );
    }

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  public async createUser(createUserDto: CreateUserDto) {
    return await this.createUserProvider.createUser(createUserDto);
  }

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return await this.userCreateManyProvider.createMany(createManyUsersDto);
  }

  public findOneUserByEmail(email: string) {
    return this.findOneUserByEmailProvider.findOneUserByEmail(email);
  }

  public findOneByGoogleId(googleId: string) {
    return this.findOneByGoogleIdProvider.findOneByGoogleId(googleId);
  }
}
