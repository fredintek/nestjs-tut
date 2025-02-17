import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Users } from '../users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { MailService } from 'src/mail/providers/mail.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    /**
     * Inject user repository
     */
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    /**
     * Inject hashing provider
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    /**
     * Injecting Mail Service
     */
    private readonly mailService: MailService,

    /**
     * Injecting Datasource
     */
    private readonly datasource: DataSource,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<Users> {
    // TODO: Implement database transaction for creating users and sending a welcome email.
    const queryRunner = this.datasource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Check if user already exists
      const foundUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (foundUser) {
        throw new BadRequestException('User already exists');
      }

      // Create new user
      const newUser = queryRunner.manager.create(Users, {
        ...createUserDto,
        password: await this.hashingProvider.hashPassword(
          createUserDto.password,
        ),
      });

      await queryRunner.manager.save(newUser);

      // Send welcome email
      await this.mailService.sendUserWelcome(newUser);

      // Commit transaction if everything is successful
      await queryRunner.commitTransaction();

      return newUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later',
        { description: error.message || 'Database or email error' },
      );
    } finally {
      try {
        // release connection
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException(
          'Could not release connection transaction',
          { description: String(error) },
        );
      }
    }
  }
}
