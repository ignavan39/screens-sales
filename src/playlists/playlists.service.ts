import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { CreatePlaylistDto } from './dto/playlists.dto';
import { Playlist } from './entity/playlist.entity';

@Injectable()
export class PlaylistCrudService extends TypeOrmCrudService<Playlist> {
  constructor(@InjectRepository(Playlist) repository: Repository<Playlist>) {
    super(repository);
  }
}

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private readonly repository: Repository<Playlist>,
  ) {}

  async save(
    userId: User['id'],
    createPlaylistDto: CreatePlaylistDto,
  ): Promise<Playlist> {
    return this.repository.save({
      userId,
      ...createPlaylistDto,
    });
  }

  async findOne(id: Playlist['id']) {
    return this.repository.findOne(id, { relations: ['contents'] });
  }
}
