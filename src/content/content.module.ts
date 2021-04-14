import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from 'src/playlists/entity/playlist.entity';
import { PlaylistsModule } from 'src/playlists/playlists.module';
import { PlaylistService } from 'src/playlists/playlists.service';
import { ContentController } from './content.controller';
import { ContentCrudService, ContentService } from './content.service';
import { ContentToPlaylists } from './entity/content-to-playlist.entity';
import { Content } from './entity/content.entity';

@Module({
  controllers: [ContentController],
  providers: [ContentService, ContentCrudService],
  imports: [TypeOrmModule.forFeature([Content]), PlaylistsModule],
  exports: [ContentService],
})
export class ContentModule {}
