import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentController } from './content.controller';
import { Content } from './entity/content.entity';
import { ContentToPlaylistModule } from 'src/content-to-playlist/content-to-playlist.module';
import { ContentService } from './content.service';
import { PlaylistsModule } from 'src/playlists/playlists.module';

@Module({
  controllers: [ContentController],
  providers: [ContentService],
  imports: [
    TypeOrmModule.forFeature([Content]),
    ContentToPlaylistModule,
    PlaylistsModule,
  ],
  exports: [ContentService],
})
export class ContentModule {}
