// import { LogsModule } from './modules/logs/logs.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { CustomersModule } from './modules/customer/customer.module';
import { SubaccountsModule } from './modules/subaccounts/subaccounts.module';
import { ConfigModule } from '@nestjs/config';

import * as typeOrmConfig from './database/typeorm.config';
import * as config from 'config';
import { ScheduleModule } from '@nestjs/schedule';

const mailConfig = config.get('mail');

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || mailConfig.host,
        port: process.env.MAIL_PORT || mailConfig.port,
        auth: {
          user: process.env.MAIL_USER || mailConfig.user,
          pass: process.env.MAIL_PASS || mailConfig.pass,
        },
      },
      template: {
        dir: join(__dirname, '..', '/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    CustomersModule,
    SubaccountsModule,
    // LogsModule,
  ],
})
export class AppModule {}
