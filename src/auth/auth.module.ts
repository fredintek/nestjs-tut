import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from 'src/users/users.module';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { SignInProvider } from './providers/sign-in.provider';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import { GoogleAuthenticationController } from './social/google-authentication.controller';
import { GoogleAuthenticationService } from './social/providers/google-authentication.service';

@Module({
  controllers: [AuthController, GoogleAuthenticationController],
  providers: [
    AuthService,
    { provide: HashingProvider, useClass: BcryptProvider },
    SignInProvider,
    GenerateTokensProvider,
    RefreshTokensProvider,
    GoogleAuthenticationService,
  ],
  imports: [forwardRef(() => UsersModule)],
  exports: [AuthService, HashingProvider],
})
export class AuthModule {}
