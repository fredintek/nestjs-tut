import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from 'src/users/providers/users.service';
import { ActiveUserInterface } from '../interfaces/active-user.interface';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    /**
     * Injecting Jwt Configuration
     */
    private readonly jwtService: JwtService,

    /**
     * Injecting Global Configuration
     */
    private readonly configService: ConfigService,

    /**
     * Injecting Generate Token Provider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,

    /**
     * Injecting The User Service
     */
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      // verify that the refresh token is valid
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserInterface, 'sub'>
      >(refreshTokenDto.refreshToken, {
        issuer: this.configService.get('jwt.issuer'),
        audience: this.configService.get('jwt.audience'),
        secret: this.configService.get('jwt.secret'),
      });
      // get the user from the database
      const user = await this.userService.findOneUser(sub);
      // generate a new access token
      return await this.generateTokensProvider.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
