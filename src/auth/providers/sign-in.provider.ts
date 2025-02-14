import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/sigin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
  constructor(
    /**
     * Inject User Service
     */
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    /**
     * Inject Hashing Provider
     */
    private readonly hashingProvider: HashingProvider,

    /**
     * Inject GlobalConfiguration
     */
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    // Find the user with email
    const user = await this.userService.findOneUserByEmail(signInDto.email);

    // Compare password to the database hash
    let isEqual: boolean = false;

    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password as string,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare password',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Invalid password');
    }

    // Generate tokens and send
    return await this.generateTokensProvider.generateTokens(user);
  }
}
