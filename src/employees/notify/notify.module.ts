import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { NotifyProcessor } from './notify.processor';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'notify',
            defaultJobOptions: {
                removeOnComplete: true,
            },
        }),
    ],
    providers: [NotifyProcessor],
})
export class NotifyModule {}
