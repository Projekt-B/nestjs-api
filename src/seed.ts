import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const seedService = app.get(SeedService);

    try {
        console.log('Starting the seeder....');
        await seedService.seedData();
    } catch (error) {
        console.error('Failed to seed the database:', error);
    } finally {
        await app.close();
    }
}

bootstrap();
