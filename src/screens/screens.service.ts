import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Event } from 'src/events/event.entity';
import { Repository } from 'typeorm';
import { Screen } from './screen.entity';

@Injectable()
export class ScreensCrudService extends TypeOrmCrudService<Screen> {
  constructor(@InjectRepository(Screen) screenRepository: Repository<Screen>) {
    super(screenRepository);
  }
}

@Injectable()
export class ScreensService {
  constructor(
    @InjectRepository(Screen)
    private screenRepository: Repository<Screen>,
  ) {}

  async findMany(eventId: Event['id']): Promise<Screen[]> {
    return this.screenRepository.find({
      where: {
        eventId,
      },
    });
  }

  async save(
    name: Screen['id'],
    width: Screen['width'],
    height: Screen['height'],
    userId: Screen['userId'],
    eventId: Screen['eventId'],
    playlistId: Screen['playlistId'],
  ) {
    return this.screenRepository.save({
      name,
      width,
      height,
      userId,
      eventId,
      playlistId,
    });
  }
}
