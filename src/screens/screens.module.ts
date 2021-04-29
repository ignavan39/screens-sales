import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from 'src/events/events.module';
import { UsersModule } from 'src/users/users.module';
import { Screen } from './screen.entity';
import { ScreensController } from './screens.controller';
import { ScreensCrudService, ScreensService } from './screens.service';

@Module({
  controllers: [ScreensController],
  providers: [ScreensService, ScreensCrudService],
  imports: [TypeOrmModule.forFeature([Screen]), EventsModule, UsersModule],
  exports: [ScreensService, ScreensCrudService],
})
export class ScreensModule {}
