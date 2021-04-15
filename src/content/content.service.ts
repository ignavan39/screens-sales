import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentToPlaylistService } from 'src/content-to-playlist/content-to-playlist.service';
import { Playlist } from 'src/playlists/entity/playlist.entity';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateContentDto, MoveIncludeContentDto, UpdateContentDto } from './dto/content.dto';
import { Content } from './entity/content.entity';


@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content) private readonly repository: Repository<Content>,
    private readonly contentToPlaylistService: ContentToPlaylistService
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
          id: playlistId,
        },
      },
    });

    return res;
  }

  async save(createDto: CreateContentDto) {
    const content = await this.repository.save({
      ...createDto,
      userId: createDto.userId,
    });

    if (createDto.playlistsId){
      const  contentToPlaylist = await this.contentToPlaylistService.save(createDto.playlistsId, content.id)
      return { ...contentToPlaylist, ...content }
    }

    return content;
  }

  async update(updateDto: UpdateContentDto,id: Content['id']) {
    const content = this.repository.findOne(id)
    return this.repository.save({...content, ...updateDto})
  }

  async moveContentInPlaylist(dto: MoveIncludeContentDto,id: Content['id']){
    
  }
}
