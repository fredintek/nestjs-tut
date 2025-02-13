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
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
     * Inject JwtService
     */
    private readonly jwtService: JwtService,

    /**
     * Inject GlobalConfiguration
     */
    private readonly configService: ConfigService,
  ) {}

  public async signIn(signInDto: SignInDto) {
    // Find the user with email
    const user = await this.userService.findOneUserByEmail(signInDto.email);

    // Compare password to the database hash
    let isEqual: boolean = false;

    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare password',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Invalid password');
    }

    // Send confirmation
    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, email: user.email },
      {
        expiresIn: this.configService.get<string>('jwt.expiresIn'),
        issuer: this.configService.get<string>('jwt.issuer'),
        audience: this.configService.get<string>('jwt.audience'),
      },
    );

    return {
      accessToken,
    };
  }
}
