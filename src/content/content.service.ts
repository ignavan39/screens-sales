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

  async delete(id: Content['id']) {
    const content = await this.findOne(id);
    try {
      const groupContents = await this.contentToPlaylistService.findManyByContent(
        content.id,
      );
      await this.awsService.deleteFile(content.key);

      await groupContents.map(async (item) => {
        const optimalContent = await this.getOptimalContent(
          content.groupId,
          item.playlistId,
        );
        await this.contentToPlaylistService.delete(id, item.playlistId);

        const contentToPlaylist = await this.contentToPlaylistService.findOne(
          item.playlistId,
          optimalContent.id,
        );

        if (!contentToPlaylist) {
          await this.playlistService.insertContent(
            item.playlistId,
            optimalContent.id,
          );
        }
      });

      await this.repository.delete(content.id);
      return content;
    } catch (e) {
      throw new BadGatewayException('Failed delete');
    }
  }

  async save(createContentDto: CreateContentDto, buffer: Buffer) {
    const width = Number.parseInt(createContentDto.width);
    const height = Number.parseInt(createContentDto.height);

    const { url, key } = await this.awsService.uploadFile(
      buffer,
      createContentDto.name,
    );

    let group = await this.groupService.findOne(createContentDto.groupId);

    if (!group) {
      group = await this.groupService.save(createContentDto.userId);
    }
    const content = await this.repository.save({
      ...createContentDto,
      url,
      key,
      width,
      height,
      groupId: group.id,
    });
    if (createContentDto.playlistId) {
      const optimalContent = await this.getOptimalContent(
        content.groupId,
        createContentDto.playlistId,
      );
      let contentToPlaylist = await this.contentToPlaylistService.findOne(
        createContentDto.playlistId,
        optimalContent.id,
      );

      if (!contentToPlaylist) {
        contentToPlaylist = await this.playlistService.insertContent(
          createContentDto.playlistId,
          optimalContent.id,
        );
      }
      if (createContentDto.duration) {
        await this.contentToPlaylistService.updateDuration(
          createContentDto.playlistId,
          optimalContent.id,
          createContentDto.duration,
        );
      }
      return { ...contentToPlaylist, ...content };
    }
    return content;
  }

  async getOptimalContent(
    groupId: GroupsContent['id'],
    playlistId: Playlist['id'],
  ) {
    const screen = await this.screenService.findOne({
      where: {
        playlistId,
      },
    });
    const contentGroup = await this.repository.find({
      where: {
        groupId,
      },
    });

    const minH = Math.abs(contentGroup[0].height - screen.height);
    const minW = Math.abs(contentGroup[0].width - screen.width);
    let optimalContent = contentGroup[0];
    contentGroup.map((item) => {
      if (
        Math.abs(item.height - screen.height) <= minH &&
        item.width - screen.width <= minW
      ) {
        optimalContent = item;
      }
    });

    return optimalContent;
  }

  async findOne(id: Content['id']): Promise<Content | null> {
    return this.repository.findOne(id);
  }

  async update(updateDto: UpdateContentDto, id: Content['id']) {
    const content = this.repository.findOne(id);
    return this.repository.save({ ...content, ...updateDto });
  }

  async addContentIntoGroup(groupId: GroupsContent['id'], id: Content['id']) {
    const content = await this.findOne(id);
    return this.repository.save({ ...content, groupId });
  }
}
