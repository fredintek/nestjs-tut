import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;

  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.None]: { canActivate: () => true },
    [AuthType.Bearer]: this.accessTokenGuard,
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get authTypes from the metadata using the reflector
    const authTypes = this.reflector.getAllAndOverride(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || [AuthenticationGuard.defaultAuthType];

    // console.log('AUTH TYPES', authTypes);

    // Array of guards
    const guards = authTypes
      .map((authType: number) => this.authTypeGuardMap[authType])
      .flat(Infinity);
    // console.log('GUARDS', guards);

    // Default error
    const error = new UnauthorizedException();

    // Loop guards canActivate
    for (const guard of guards) {
      // console.log('INSTANCES', guard);
      const canActivate = await Promise.resolve(
        guard.canActivate(context),
      ).catch((err) => {
        error: err;
      });

      // console.log('CANACTIVATE', canActivate);
      if (canActivate) {
        return true;
      }
    }
    throw error;
  }
}
