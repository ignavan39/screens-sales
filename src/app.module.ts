import { Controller, Delete, Get, Module, Patch, Post } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './typeorm-constant';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { ScreensModule } from './screens/screens.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { ContentModule } from './content/content.module';
import { ContentToPlaylistModule } from './content-to-playlist/content-to-playlist.module';
import { GroupContentModule } from './group-content/group-content.module';
import { AwsModule } from './aws/aws.module';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    AuthModule,
    UsersModule,
    EventsModule,
    ScreensModule,
    PlaylistsModule,
    ContentModule,
    ContentToPlaylistModule,
    GroupContentModule,
    AwsModule,
  ],
})
export class AppModule {}
