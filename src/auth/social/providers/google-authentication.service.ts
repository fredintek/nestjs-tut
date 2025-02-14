import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    /**
     * Injecting Global Configuration
     */
    private readonly configService: ConfigService,

    /**
     * Injecting User Service
     */
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    /**
     * Injecting Generate Token Provider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  async onModuleInit() {
    const clientId = this.configService.get('jwt.googleClientId');
    const clientSecret = this.configService.get('jwt.googleClientSecret');

    this.oauthClient = new OAuth2Client({ clientId, clientSecret });
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    // verify the google token sent by the user
    const loginTicket = await this.oauthClient.verifyIdToken({
      idToken: googleTokenDto.token,
    });

    // extract user information from the google loginTicket
    const { email, sub: googleId } = loginTicket.getPayload() as TokenPayload;

    // find the user in the database using the google ID
    const user = await this.userService.findOneByGoogleId(googleId);

    // If google ID exists generate token
    if (user) {
      return this.generateTokensProvider.generateTokens(user);
    }

    // If not create a new user

    // throw unauthorized exception
  }
}
