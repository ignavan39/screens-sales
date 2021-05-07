import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from 'src/content/content.entity';
import { Playlist } from 'src/playlists/playlist.entity';
import { Repository } from 'typeorm';
import { ContentToPlaylists } from './content-to-playlist.entity';

@Injectable()
export class ContentToPlaylistService {
  constructor(
    @InjectRepository(ContentToPlaylists)
    private readonly repository: Repository<ContentToPlaylists>,
  ) {}

  async findContentByPlaylistId(
    playlistId: Playlist['id'],
  ): Promise<ContentToPlaylists[]> {
    return this.repository.find({
      where: {
        playlistId,
      },
      relations: ['content'],
    });
  }

  async findManyByContent(
    contentId: Content['id'],
  ): Promise<ContentToPlaylists[]> {
    return this.repository.find({
      where: {
        contentId,
      },
    });
  }

  async updateDuration(
    playlistId: Playlist['id'],
    contentId: Content['id'],
    duration: number,
  ) {
    const contentToPlaylist = await this.findOne(playlistId, contentId);

    return this.repository.save({
      ...contentToPlaylist,
      duration,
    });
  }

  async findOne(playlistId: Playlist['id'], contentId: Content['id']) {
    return this.repository.findOne({
      contentId,
      playlistId,
    });
  }

  async save(
    playlistId: Playlist['id'],
    contentId: Content['id'],
  ): Promise<ContentToPlaylists> {
    const playlistSize = await this.getPlaylistSize(playlistId);

    const order = playlistSize + 1;
    return this.repository.save({
      playlistId,
      contentId,
      order,
    });
  }

  moveContentBackSide(
    playlist: ContentToPlaylists[],
    contentId: Content['id'],
    order: number,
    oldOrder: number,
  ) {
    return playlist.map((v) => {
      if (v.contentId === contentId) {
        return { ...v, order };
      } else if (v.order <= order && v.order > oldOrder) {
        return { ...v, order: v.order - 1 };
      }
      return v;
    });
  }
  moveContentForwardSide(
    playlist: ContentToPlaylists[],
    contentId: Content['id'],
    order: number,
    oldOrder: number,
  ) {
    return playlist.map((item) => {
      if (item.contentId === contentId) {
        return { ...item, order };
      } else if (item.order >= order && item.order < oldOrder) {
        return { ...item, order: item.order + 1 };
      }
      return item;
    });
  }

  async moveContent(
    playlistId: Playlist['id'],
    contentId: Content['id'],
    order: number,
  ): Promise<ContentToPlaylists[] | ContentToPlaylists> {
    const playlist = await this.findContentByPlaylistId(playlistId);
    const content = await this.findOne(playlistId, contentId);
    const oldOrder = content.order;

    if (order > oldOrder) {
      const movedPlaylist = await this.moveContentBackSide(
        playlist,
        contentId,
        order,
        oldOrder,
      );
      return this.repository.save(movedPlaylist);
    }

    const movedPlaylist = await this.moveContentForwardSide(
      playlist,
      contentId,
      order,
      oldOrder,
    );

    return this.repository.save(movedPlaylist);
  }

  async getPlaylistSize(playlistId: Playlist['id']): Promise<number> {
    return this.repository.count({
      where: {
        playlistId,
      },
    });
  }

  async delete(contentToPlaylistId: ContentToPlaylists['id']) {
    const contentToPlaylist = await this.repository.findOne(
      contentToPlaylistId,
    );
    await this.repository.delete(contentToPlaylistId);
    return contentToPlaylist;
  }

  async saveAll(contentsToPlaylist: ContentToPlaylists[]) {
    this.repository.save(contentsToPlaylist);
  }
}
