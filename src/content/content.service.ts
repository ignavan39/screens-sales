import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentToPlaylistService } from 'src/content-to-playlist/content-to-playlist.service';
import { Playlist } from 'src/playlists/playlist.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateContentDto, UpdateContentDto } from './content.dto';
import { Content } from './content.entity';
import { AwsService } from 'src/aws/aws.service';
import { PlaylistService } from 'src/playlists/playlists.service';
import { GroupContentService } from 'src/group-content/group-content.service';
import { group } from 'node:console';
import { GroupsContent } from 'src/group-content/group-content.entity';
import { ScreensCrudService } from 'src/screens/screens.service';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content) private readonly repository: Repository<Content>,
    private readonly contentToPlaylistService: ContentToPlaylistService,
    private readonly awsService: AwsService,
    private readonly playlistService: PlaylistService,
    private readonly groupService: GroupContentService,
    private readonly screenService: ScreensCrudService,
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
        const optimalContent = await this.getOptimalContent(
          content.groupId,
          content.playlistId,
        );
        const contentToPlaylist = await this.playlistService.insertContent(
          content.playlistId,
          optimalContent.id,
        );
        if (createDto.duration) {
          await this.contentToPlaylistService.updateDuration(
            createDto.playlistId,
            optimalContent.id,
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

  async getOptimalContent(
    groupId: GroupsContent['id'],
    playlistId: Playlist['id'],
  ): Promise<Content> {
    const screen = await this.screenService.findOne({
      where: {
        playlistId,
      },
    });
    const group = await this.groupService.findOne(groupId);
    const sortedContents = group.contents.sort(
      (item1, item2) => item1.height - item2.height,
    );

    let idx = sortedContents.findIndex(
      (item) => item.height === screen.height && item.width === screen.width,
    );

    if (idx === -1) {
      idx = sortedContents.findIndex(
        (item) => screen.height > item.height && screen.width > item.width,
      );
      if (idx === -1) {
        return sortedContents[0];
      }
    }
    return sortedContents[idx];
  }

  async addContentIntoGroup(groupId: GroupsContent['id'], id: Content['id']) {
    const content = await this.findOne(id);
    return this.repository.save({ ...content, groupId });
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
