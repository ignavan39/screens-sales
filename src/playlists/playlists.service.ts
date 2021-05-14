import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ContentToPlaylistService } from 'src/content-to-playlist/content-to-playlist.service';
import { ContentToPlaylists } from 'src/content-to-playlist/content-to-playlist.entity';
import { Content } from 'src/content/content.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreatePlaylistDto, UpdatePlaylistDto } from './playlists.dto';
import { Playlist } from './playlist.entity';
import { MoveContentDto } from 'src/content/content.dto';
import {
  ScreensCrudService,
  ScreensService,
} from 'src/screens/screens.service';
import { ContentService } from 'src/content/content.service';
import { Screen } from 'src/screens/screen.entity';

import { v4 as uuid } from 'uuid';

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
    private readonly contentService: ContentService,
  ) {}

  async save(
    userId: User['id'],
    createPlaylistDto: CreatePlaylistDto,
  ): Promise<Playlist> {
    const playlist = await this.repository.save({
      userId,
      ...createPlaylistDto,
    });

    if (createPlaylistDto.screenId) {
      await this.screenService.attachPlaylist(
        playlist.id,
        createPlaylistDto.screenId,
      );
      await this.fillingPlaylistWithOptimalContents(
        playlist.id,
        createPlaylistDto.screenId,
      );
    }
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

  async fillingPlaylistWithOptimalContents(
    playlistId: Playlist['id'],
    screenId: Screen['id'],
  ) {
    const playlist = await this.repository.findOne(playlistId);
    const contentByPlaylist = await this.contentToPlaylistService.findContentByPlaylistId(
      playlistId,
    );

    const optimalPlaylist = await Promise.all(
      contentByPlaylist.map(async (item) => {
        const optimalContent = await this.contentService.getOptimalContent(
          item.content.groupId,
          screenId,
        );

        await this.contentToPlaylistService.delete(item.id);
        const newContentToPlaylist: ContentToPlaylists = {
          id: uuid(),
          order: item.order,
          duration: item.duration,
          playlist,
          playlistId: playlist.id,
          content: optimalContent,
          contentId: optimalContent.id,
        };
        return newContentToPlaylist;
      }),
    );
    await this.contentToPlaylistService.saveAll(optimalPlaylist);
  }

  async update(playlistId: Playlist['id'], updateDto: UpdatePlaylistDto) {
    const playlist = await this.repository.findOne(playlistId);
    if (updateDto.screenId) {
      await this.screenService.attachPlaylist(playlist.id, updateDto.screenId);
      await this.fillingPlaylistWithOptimalContents(
        playlist.id,
        updateDto.screenId,
      );
    }
    return this.repository.save({ ...playlist, ...updateDto });
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
