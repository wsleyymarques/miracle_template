import { Injectable, Logger } from '@nestjs/common';
import { MailService } from './mail.service';

@Injectable()
export class ConsoleMailService implements MailService {
  private readonly logger = new Logger('MailService[console]');

  async sendPasswordResetCode(email: string, code: string): Promise<void> {
    this.logger.log(`Código de redefinição para ${email}: ${code}`);
  }
}
