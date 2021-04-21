import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentToPlaylistService } from 'src/content-to-playlist/content-to-playlist.service';
import { Playlist } from 'src/playlists/playlist.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import {
  AddContentIntoGroup,
  CreateContentDto,
  UpdateContentDto,
} from './content.dto';
import { Content } from './content.entity';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content) private readonly repository: Repository<Content>,
    private readonly contentToPlaylistService: ContentToPlaylistService,
  ) {}

  async findManyByUser(userId: User['id']): Promise<Content[]> {
    return this.repository.find({
      where: {
        userId,
      },
    });
  }

  async findMany(playlistId: Playlist['id']): Promise<Content[]> {
    const res = await this.repository.find({
      relations: ['playlists'],
      where: {
        playlists: {
          id: playlistId,
        },
      },
    });

    return res;
  }

  async save(createDto: CreateContentDto): Promise<Content> {
    const content = await this.repository.save({
      ...createDto,
      userId: createDto.userId,
    });

    if (createDto.playlistId) {
      const contentToPlaylist = await this.contentToPlaylistService.save(
        createDto.playlistId,
        content.id,
      );
      if (createDto.duration) {
        await this.contentToPlaylistService.updateDuration(
          createDto.playlistId,
          content.id,
          createDto.duration,
        );
      }
      return { ...contentToPlaylist, ...content };
    }

    return content;
  }

  async findOne(id: Content['id']): Promise<Content | null> {
    return this.repository.findOne(id);
  }

  async update(updateDto: UpdateContentDto, id: Content['id']) {
    const content = this.repository.findOne(id);
    return this.repository.save({ ...content, ...updateDto });
  }

  async addContentIntoGroup(dto: AddContentIntoGroup, id: Content['id']) {
    const content = this.repository.findOne(id);
    return this.repository.save({ ...content, ...dto });
  }
}
