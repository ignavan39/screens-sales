import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ContentToPlaylistService } from 'src/content-to-playlist/content-to-playlist.service';
import { Playlist } from 'src/playlists/entity/playlist.entity';
import { PlaylistService } from 'src/playlists/playlists.service';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateContentDto, UpdateContentDto } from './dto/content.dto';
import { Content } from './entity/content.entity';

@Injectable()
export class ContentCrudService extends TypeOrmCrudService<Content> {
  constructor(
    @InjectRepository(Content)
    repository: Repository<Content>,
  ) {
    super(repository);
  }
}

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content) private readonly repository: Repository<Content>,
  ) {}

  async findManyByUser(userId: User['id']): Promise<Content[]> {
    return this.repository.find({
      where: {
        userId,
      },
    });
  }

  async findMany(playlistId: Playlist['id']) {
    const res = await this.repository.find({
      relations: ['playlists'],
      where: {
        playlists: {
          id: playlistId
        }
      }
    });

    return res;
  }


  async save(createDto: CreateContentDto): Promise<Content> {

    const content =  await this.repository.save({
      ...createDto,
      userId: createDto.userId
    });
    return content;
      
  }

  async update(updateDto: UpdateContentDto) {
    if (updateDto.order) {
      const currentPlaylist = await this.findMany(updateDto.playlistsId);
      // add checking
      // const idx = currentPlaylist.findIndex(item => item.order === updateDto.order)
      console.log(currentPlaylist);
    }
  }
}
