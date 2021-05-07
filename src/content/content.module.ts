import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentController } from './content.controller';
import { Content } from './content.entity';
import { ContentToPlaylistModule } from 'src/content-to-playlist/content-to-playlist.module';
import { ContentService } from './content.service';
import { PlaylistsModule } from 'src/playlists/playlists.module';
import { AwsModule } from 'src/aws/aws.module';
import { UsersModule } from 'src/users/users.module';
import { GroupContentModule } from 'src/group-content/group-content.module';
import { ScreensModule } from 'src/screens/screens.module';
import { ContentSubscriber } from './content.subscriber';
import { Connection } from 'typeorm';
import { ContentToPlaylistService } from 'src/content-to-playlist/content-to-playlist.service';

@Module({
  controllers: [ContentController],
  providers: [ContentService, ContentSubscriber],
  imports: [
    TypeOrmModule.forFeature([Content]),
    ContentToPlaylistModule,
    AwsModule,
    UsersModule,
    GroupContentModule,
    ScreensModule,
  ],
  exports: [ContentService, ContentSubscriber],
})
export class ContentModule {}
