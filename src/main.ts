import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import {
    BadRequestException,
    HttpStatus,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get<ConfigService>(ConfigService);
    const { httpAdapter } = app.get(HttpAdapterHost);

    //==================================================================================================================
    // Validation: transforms default output into "Record<param_name: errors[]>
    // Purpose: help frontend render error (arrays) under the approprite form input
    //==================================================================================================================
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

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Employees')
        .setDescription('Employees API')
        .setVersion('1.0')
        .addTag('employees')
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);

    //==================================================================================================================
    // This deals with Prisma exception thrown when unique key constraint is hit, i.e. email is already taken
    // It renders user-friendly error message
    //==================================================================================================================
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
