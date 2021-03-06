import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Event } from 'src/events/event.entity';
import { Playlist } from 'src/playlists/playlist.entity';
import { Repository } from 'typeorm';
import { CreateScreenDto } from './screen.dto';
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
    CreateScreenDto: CreateScreenDto,
    playlistId: Screen['playlistId'],
  ) {
    return this.screenRepository.save({
      ...CreateScreenDto,
      playlistId,
    });
  }

  async attachPlaylist(playlistId: Playlist['id'], screenId: Screen['id']) {
    const screen = await this.screenRepository.findOne(screenId);
    return this.screenRepository.save({
      ...screen,
      playlistId,
    });
  }
}
