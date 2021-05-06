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
      const contentsToPlaylist = await this.contentToPlaylistService.findContentByPlaylistId(
        playlist.id,
      );
      const contentToPlaylist = await this.contentToPlaylistService.findOne(
        playlist.id,
        content.id,
      );
      const cleanedPlaylist = contentsToPlaylist.filter(
        (item) => item.contentId !== content.id,
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
