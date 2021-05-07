import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { ContentToPlaylistService } from 'src/content-to-playlist/content-to-playlist.service';
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  RemoveEvent,
} from 'typeorm';
import { Content } from './content.entity';

@EventSubscriber()
export class ContentSubscriber implements EntitySubscriberInterface<Content> {
  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly contentToPlaylistService: ContentToPlaylistService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Content;
  }

  async beforeRemove(event: RemoveEvent<Content>) {
    const content = event.entity;
    const playlists = await this.contentToPlaylistService.findManyByContent(
      content.id,
    );
    await playlists.map(async (playlist) => {
      const includeContents = await this.contentToPlaylistService.findContentByPlaylistId(
        playlist.playlistId,
      );
      const contentToPlaylist = await this.contentToPlaylistService.findOneByPlaylistAndContent(
        playlist.playlistId,
        content.id,
      );

      const cleanedPlaylist = includeContents.filter(
        (item) => item.id !== contentToPlaylist.id,
      );

      const movedPlaylist = cleanedPlaylist.map((item) => {
        if (item.order > contentToPlaylist.order) {
          return {
            ...item,
            order: item.order - 1,
          };
        }
        return item;
      });
      await this.contentToPlaylistService.saveAll(movedPlaylist);
    });
  }
}
