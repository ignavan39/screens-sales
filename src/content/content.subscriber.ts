import { Inject, Injectable } from '@nestjs/common';
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
    // private readonly connection: Connection,
    @Inject('ContentToPlaylistService')
    private readonly contentToPlaylistService: ContentToPlaylistService,
  ) {
    // this.connection.subscribers.push(this);
  }

  listenTo() {
    return Content;
  }

  async beforeRemove(event: RemoveEvent<Content>) {
    const content = event.entity;
    console.log(event.entity);
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
