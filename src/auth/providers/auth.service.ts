import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  public login(email: string, password: string) {
    // check if user exists
    const user = this.userService.findOneUser({ id: 123 });

    return 'SAMPLE_TOKEN';
  }

  public isAuthenticated() {
    return true;
  }
}
