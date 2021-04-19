import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ContentToPlaylistService } from 'src/content-to-playlist/content-to-playlist.service';
import { ContentToPlaylists } from 'src/content-to-playlist/entity/content-to-playlist.entity';
import { MoveIncludeContentDto } from 'src/content/dto/content.dto';
import { Content } from 'src/content/entity/content.entity';
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
    private readonly contentToPlaylistService: ContentToPlaylistService,
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

  async findIncludeContent(
    playlistId: Playlist['id'],
  ): Promise<ContentToPlaylists[]> {
    return this.contentToPlaylistService.findContentByPlaylistId(playlistId);
  }

  async moveContent(
    playlistId: Playlist['id'],
    contentId: Content['id'],
    dto: MoveIncludeContentDto,
  ): Promise<ContentToPlaylists[] | ContentToPlaylists> {
    console.log(dto);
    return this.contentToPlaylistService.moveContent(
      playlistId,
      contentId,
      dto.order,
    );
  }

  async insertContent(
    id: Playlist['id'],
    contentId: Content['id'],
  ): Promise<ContentToPlaylists> {
    return this.contentToPlaylistService.save(id, contentId);
  }
}
