import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { PrismaService } from '../prisma.service';
import { CryptoService } from '../crypto/crypto.service';
import { NotifyModule } from './notify/notify.module';
import { BullModule } from '@nestjs/bull';

@Module({
    imports: [
        NotifyModule,
        BullModule.registerQueue({
            name: 'notify',
        }),
    ],
    controllers: [EmployeesController],
    providers: [EmployeesService, PrismaService, CryptoService],
})
export class EmployeesModule {}
