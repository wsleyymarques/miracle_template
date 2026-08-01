import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConsoleMailService } from './console-mail.service';
import { MAIL_SERVICE } from './mail.service';
import { NodemailerMailService } from './nodemailer-mail.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    ConsoleMailService,
    NodemailerMailService,
    {
      provide: MAIL_SERVICE,
      useFactory: (
        config: ConfigService,
        consoleMail: ConsoleMailService,
        nodemailerMail: NodemailerMailService,
      ) => {
        const driver = config.get<string>('MAIL_DRIVER', 'console');
        return driver === 'smtp' ? nodemailerMail : consoleMail;
      },
      inject: [ConfigService, ConsoleMailService, NodemailerMailService],
    },
  ],
  exports: [MAIL_SERVICE],
})
export class MailModule {}
