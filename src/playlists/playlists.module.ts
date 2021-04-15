import { Module } from '@nestjs/common';
import { PlaylistCrudService, PlaylistService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './entity/playlist.entity';
import { ContentToPlaylistModule } from 'src/content-to-playlist/content-to-playlist.module';

@Module({
  providers: [PlaylistService, PlaylistCrudService],
  controllers: [PlaylistsController],
  imports: [TypeOrmModule.forFeature([Playlist]),ContentToPlaylistModule],
  exports: [PlaylistService, PlaylistCrudService],
})
export class PlaylistsModule {}
