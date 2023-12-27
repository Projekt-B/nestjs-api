import { Module } from '@nestjs/common';
import { providePrismaClientExceptionFilter } from 'nestjs-prisma';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmployeesModule } from './employees/employees.module';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CryptoService } from './crypto/crypto.service';
import { PrismaService } from './prisma.service';
import { SeedService } from './seed.service';
import appConfig from '../config/app.config';
import redisConfig from '../config/redis.config';
import notifyQueueConfig from '../config/notify.queue.config';
import nodemailerConfig from '../config/nodemailer.config';

@Module({
    imports: [
        //==============================================================================================================
        // Configuration module
        //==============================================================================================================
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            load: [appConfig, redisConfig, notifyQueueConfig, nodemailerConfig],
        }),

        //==============================================================================================================
        // Queue management, via Bull
        //==============================================================================================================
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (cfg: ConfigService) => ({
                redis: {
                    host: cfg.get('redis.host'),
                    port: cfg.get('redis.port'),
                },
            }),
            inject: [ConfigService],
        }),

        //==============================================================================================================
        // Mailer module, for use with queue, achieving split (async) between http API and mail sending
        //==============================================================================================================
        MailerModule.forRootAsync({
            useFactory: async (cfg: ConfigService) => ({
                transport: {
                    host: cfg.get('nodemailer.host'),
                    port: cfg.get('nodemailer.port'),
                    tls: {
                        ciphers: cfg.get('nodemailer.tls.ciphers'),
                    },
                    secure: cfg.get('nodemailer.secure'),
                    auth: {
                        user: cfg.get('nodemailer.auth.user'),
                        pass: cfg.get('nodemailer.auth.pass'),
                    },
                },

                template: {
                    dir: process.cwd() + '/templates/email',
                    adapter: new HandlebarsAdapter(),
                },
            }),
            inject: [ConfigService],
        }),

        //==============================================================================================================
        // Employees module: the Project-B's task
        //==============================================================================================================
        EmployeesModule,
    ],
    providers: [
        PrismaService,
        CryptoService,
        providePrismaClientExceptionFilter(),
        SeedService,
    ],
    exports: [BullModule],
})
export class AppModule {}
