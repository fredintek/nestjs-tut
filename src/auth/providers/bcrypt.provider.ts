import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider extends HashingProvider {
  public async hashPassword(data: string | Buffer): Promise<string> {
    // generate salt
    const salt = await bcrypt.genSalt(12);

    // hash password
    return await bcrypt.hash(data, salt);
  }

  public async comparePassword(
    data: string,
    encrypted: string | Buffer,
  ): Promise<boolean> {
    // compare password
    return await bcrypt.compare(data, encrypted);
  }

  public checkSomething() {
    // some logic here
    return 'My name is Alfred'; // replace with actual logic
  }
}
