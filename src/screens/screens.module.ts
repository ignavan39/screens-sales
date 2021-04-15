import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/entity/event.entity';
import { EventsModule } from 'src/events/events.module';
import { EventsService } from 'src/events/events.service';
import { Screen } from './entity/screen.entity';
import { ScreensController } from './screens.controller';
import { ScreensCrudService, ScreensService } from './screens.service';

@Module({
  controllers: [ScreensController],
  providers: [ScreensService, ScreensCrudService],
  imports: [TypeOrmModule.forFeature([Screen]), EventsModule],
  exports: [ScreensService],
})
export class ScreensModule {}
