import { Module } from '@nestjs/common';
import { EventsCrudService, EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { Auth0Guard } from 'src/auth/auth.guard';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [EventsService, EventsCrudService],
  controllers: [EventsController],
  imports: [TypeOrmModule.forFeature([Event]), UsersModule],
  exports: [EventsService, EventsCrudService],
})
export class EventsModule {}
