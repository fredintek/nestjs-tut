import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Users } from 'src/users/users.entity';

@Injectable()
export class MailService {
  constructor(
    /**
     * Injecting MailerService
     */
    private mailerService: MailerService,
  ) {}
  public async sendUserWelcome(user: Users): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      from: 'noreply@example.com',
      subject: 'Welcome to our platform!',
      template: './welcome',
      context: { user },
    });
  }
}
