import { Module } from '@nestjs/common';
import { PlaylistCrudService, PlaylistService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { ContentToPlaylistModule } from 'src/content-to-playlist/content-to-playlist.module';
import { ScreensModule } from 'src/screens/screens.module';
import { UsersModule } from 'src/users/users.module';
import { ContentModule } from 'src/content/content.module';

@Module({
  providers: [PlaylistService, PlaylistCrudService],
  controllers: [PlaylistsController],
  imports: [
    TypeOrmModule.forFeature([Playlist]),
    ContentToPlaylistModule,
    ScreensModule,
    UsersModule,
    ContentModule,
  ],
  exports: [PlaylistService, PlaylistCrudService],
})
export class PlaylistsModule {}
