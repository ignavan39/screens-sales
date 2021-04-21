import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ContentToPlaylistService } from 'src/content-to-playlist/content-to-playlist.service';
import { ContentToPlaylists } from 'src/content-to-playlist/content-to-playlist.entity';
import {
  InsertContentDto,
  MoveIncludeContentDto,
} from 'src/content/content.dto';
import { Content } from 'src/content/content.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreatePlaylistDto } from './playlists.dto';
import { Playlist } from './playlist.entity';

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

  async updateDuration(
    playlistId: Playlist['id'],
    contentId: Content['id'],
    duration: number,
  ): Promise<ContentToPlaylists> {
    return this.contentToPlaylistService.updateDuration(
      playlistId,
      contentId,
      duration,
    );
  }

  async findContents(
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
    playlistId: Playlist['id'],
    insertContentDto: InsertContentDto,
  ): Promise<ContentToPlaylists> {
    return this.contentToPlaylistService.save(
      playlistId,
      insertContentDto.contentId,
    );
  }

  async findAllPlaylystByUser(userId: User['id']): Promise<Playlist[]> {
    return this.repository.find({
      where: {
        userId,
      },
    });
  }
}
