import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Playlist } from 'src/playlists/entity/playlist.entity';
import { PlaylistService } from 'src/playlists/playlists.service';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateContentDto, UpdateContentDto } from './dto/content.dto';
import { Content } from './entity/content.entity';

@Injectable()
export class ContentCrudService extends TypeOrmCrudService<Content> {
  constructor(
    @InjectRepository(Content)
    repository: Repository<Content>,
  ) {
    super(repository);
  }
}

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content) private readonly repository: Repository<Content>,
    private readonly playlistService: PlaylistService,
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
    });

    return res;
  }

  async findRelatedPlaylist(playlistId: Playlist['id']) {
    return this.playlistService.findOne(playlistId);
  }

  async save(createDto: CreateContentDto): Promise<Content> {
    const currentPlaylist = await this.findRelatedPlaylist(
      createDto.playlistsId,
    );

    console.log(currentPlaylist);

    const order =
      currentPlaylist.contents.length === 0
        ? 1
        : currentPlaylist.contents.length + 1;
    const a = await this.repository.save({
      ...createDto,
      userId: currentPlaylist.userId,
      playlists: [{ id: currentPlaylist.id }],
      contentToPlaylists: [{ order, playlistId: currentPlaylist.id }],
    });

    return a;
  }

  async update(updateDto: UpdateContentDto) {
    if (updateDto.order) {
      const currentPlaylist = await this.findMany(updateDto.playlistsId);
      // add checking
      // const idx = currentPlaylist.findIndex(item => item.order === updateDto.order)
      console.log(currentPlaylist);
    }
  }
}
