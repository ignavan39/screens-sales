import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistsModule } from 'src/playlists/playlists.module';
import { ContentToPlaylistService } from './content-to-playlist.service';
import { ContentToPlaylists } from './content-to-playlist.entity';

@Module({
  providers: [ContentToPlaylistService],
  imports: [TypeOrmModule.forFeature([ContentToPlaylists])],
  exports: [ContentToPlaylistService],
})
export class ContentToPlaylistModule {}
