import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentController } from './content.controller';
import { ContentCrudService, ContentService } from './content.service';
import { Content } from './entity/content.entity';
import { ContentToPlaylistModule } from 'src/content-to-playlist/content-to-playlist.module';

@Module({
  controllers: [ContentController],
  providers: [ContentService, ContentCrudService],
  imports: [TypeOrmModule.forFeature([Content]),ContentToPlaylistModule],
  exports: [ContentService],
})
export class ContentModule {}
