import { Module } from '@nestjs/common';
import { PlaylistCrudService, PlaylistService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { ContentToPlaylistModule } from 'src/content-to-playlist/content-to-playlist.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [PlaylistService, PlaylistCrudService],
  controllers: [PlaylistsController],
  imports: [
    TypeOrmModule.forFeature([Playlist]),
    ContentToPlaylistModule,
    UsersModule,
  ],
  exports: [PlaylistService, PlaylistCrudService],
})
export class PlaylistsModule {}
