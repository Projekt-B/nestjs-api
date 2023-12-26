import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import {
    BadRequestException,
    HttpStatus,
    ValidationError,
    ValidationPipe,
    VersioningType,
} from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get<ConfigService>(ConfigService);
    const { httpAdapter } = app.get(HttpAdapterHost);

    app.enableVersioning({
        type: VersioningType.URI,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (errors: ValidationError[]) => {
                const messages = {};

                errors.forEach((error: ValidationError) => {
                    messages[error.property] = [
                        error.constraints[Object.keys(error.constraints)[0]],
                    ];
                });

                return new BadRequestException({
                    errors: messages,
                });
            },
            stopAtFirstError: true,
        }),
    );

    app.useGlobalFilters(
        new PrismaClientExceptionFilter(httpAdapter, {
            P2000: HttpStatus.BAD_REQUEST,
            P2002: HttpStatus.CONFLICT,
            P2025: HttpStatus.NOT_FOUND,
        }),
    );

    await app.listen(config.get('port') || 3000, config.get('host'));
}

bootstrap();
