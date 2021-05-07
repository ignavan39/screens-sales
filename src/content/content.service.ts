import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from 'src/playlists/playlist.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateContentDto, UpdateContentDto } from './content.dto';
import { Content } from './content.entity';
import { AwsService } from 'src/aws/aws.service';
import { GroupContentService } from 'src/group-content/group-content.service';
import { GroupsContent } from 'src/group-content/group-content.entity';
import { ScreensCrudService } from 'src/screens/screens.service';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { ContentToPlaylistService } from 'src/content-to-playlist/content-to-playlist.service';
import { Screen } from 'src/screens/screen.entity';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content) private readonly repository: Repository<Content>,
    private readonly awsService: AwsService,
    private readonly groupService: GroupContentService,
    private readonly screenService: ScreensCrudService,
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
      await this.repository.remove(content);
      await this.awsService.deleteFile(content.key);
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
    let group = null;
    if (createContentDto.groupId) {
      group = await this.groupService.findOne(createContentDto.groupId);
    }

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
      await this.contentToPlaylistService.save(
        createContentDto.playlistId,
        content.id,
      );
      if (createContentDto.duration) {
        await this.contentToPlaylistService.updateDuration(
          createContentDto.playlistId,
          content.id,
          createContentDto.duration,
        );
      }
    }

    return content;
  }

  async getOptimalContent(
    groupId: GroupsContent['id'],
    screenId: Screen['id'],
  ) {
    const screen = await this.screenService.findOne(screenId);
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
