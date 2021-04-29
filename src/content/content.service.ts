import { BadGatewayException, Injectable } from '@nestjs/common';
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
import { AwsService } from 'src/aws/aws.service';
import { PlaylistService } from 'src/playlists/playlists.service';
import { GroupContentService } from 'src/group-content/group-content.service';
import { group } from 'node:console';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content) private readonly repository: Repository<Content>,
    private readonly contentToPlaylistService: ContentToPlaylistService,
    private readonly awsService: AwsService,
    private readonly playlistService: PlaylistService,
    private readonly groupService: GroupContentService,
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
      where: {
        playlists: {
          id: playlistId,
        },
      },
    });

    return res;
  }

  async save(
    createDto: CreateContentDto,
    imageBuffer: Buffer,
  ): Promise<Content> {
    try {
      const { url, key } = await this.awsService.uploadFile(
        imageBuffer,
        createDto.name,
      );

      let groupId = null;
      if (!createDto.groupId && createDto.contentType === 'Video') {
        const group = await this.groupService.save(createDto.userId);
        groupId = group.id;
      }
      const content = await this.repository.save({
        groupId,
        ...createDto,
        url,
        key,
      });

      if (createDto.playlistId) {
        const contentToPlaylist = await this.playlistService.insertContent(
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
    } catch (e) {
      throw new BadGatewayException('Failed save');
    }
  }

  async findOne(id: Content['id']): Promise<Content | null> {
    return this.repository.findOne(id);
  }

  async update(updateDto: UpdateContentDto, id: Content['id']) {
    const content = this.repository.findOne(id);
    return this.repository.save({ ...content, ...updateDto });
  }

  async addContentIntoGroup(dto: AddContentIntoGroup, id: Content['id']) {
    return this.repository.save({ id, ...dto });
  }

  async delete(id: Content['id']): Promise<Content | null> {
    const content = await this.findOne(id);

    if (content) {
      try {
        this.awsService.deleteFile(content.key);
        await this.repository.delete(id);
      } catch (e) {
        throw new BadGatewayException('Failed delete');
      }
    }
    return content;
  }
}
