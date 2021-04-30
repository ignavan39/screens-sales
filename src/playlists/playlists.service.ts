import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ContentToPlaylistService } from 'src/content-to-playlist/content-to-playlist.service';
import { ContentToPlaylists } from 'src/content-to-playlist/content-to-playlist.entity';
import { Content } from 'src/content/content.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreatePlaylistDto } from './playlists.dto';
import { Playlist } from './playlist.entity';
import { MoveContentDto } from 'src/content/content.dto';
import {
  ScreensCrudService,
  ScreensService,
} from 'src/screens/screens.service';

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
    private readonly screenService: ScreensService,
    private readonly screenCrudService: ScreensCrudService,
  ) {}

  async save(
    userId: User['id'],
    createPlaylistDto: CreatePlaylistDto,
  ): Promise<Playlist> {
    const playlist = await this.repository.save({
      userId,
      ...createPlaylistDto,
    });
    const screen = await this.screenCrudService.findOne(
      createPlaylistDto.screenId,
    );
    await this.screenService.save(
      screen.name,
      screen.width,
      screen.height,
      screen.userId,
      screen.eventId,
      playlist.id,
    );
    return playlist;
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
    dto: MoveContentDto,
  ): Promise<ContentToPlaylists[] | ContentToPlaylists> {
    return this.contentToPlaylistService.moveContent(
      playlistId,
      contentId,
      dto.order,
    );
  }

  async insertContent(
    playlistId: Playlist['id'],
    contentId: Content['id'],
  ): Promise<ContentToPlaylists> {
    return this.contentToPlaylistService.save(playlistId, contentId);
  }

  async findAllPlaylystByUser(userId: User['id']): Promise<Playlist[]> {
    return this.repository.find({
      where: {
        userId,
      },
    });
  }
}
