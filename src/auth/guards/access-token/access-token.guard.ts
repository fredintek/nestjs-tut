import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    /**
     * Inject JwtService
     */
    private readonly jwtService: JwtService,

    /**
     * Inject GlobalConfiguration
     */
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract the request from the execution context
    const request = context.switchToHttp().getRequest();

    // Extract the token from the header
    const token = this.extractRequestFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    // Validate the token
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        audience: this.configService.get('jwt.audience'),
        issuer: this.configService.get('jwt.issuer'),
        secret: this.configService.get('jwt.secret'),
        maxAge: this.configService.get('jwt.expiresIn'),
      });
      // console.log('PAYLOAD', payload);
      // Store the payload in the request object for further use
      request[REQUEST_USER_KEY] = payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    // Accept or Deny request
    return true;
  }

  private extractRequestFromHeader(request: Request): string | null {
    const authorizationHeader = request.headers.authorization;
    if (authorizationHeader) {
      const token = authorizationHeader.split(' ')[1];
      return token;
    }
    return null;
  }
}
