import { Module } from '@nestjs/common';
import { PlaylistCrudService, PlaylistService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './entity/playlist.entity';

@Module({
  providers: [PlaylistService,PlaylistCrudService],
  controllers: [PlaylistsController],
  imports: [TypeOrmModule.forFeature([Playlist])],
  exports: [PlaylistService,PlaylistCrudService]
})
export class PlaylistsModule {}
