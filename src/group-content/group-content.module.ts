import { Module } from '@nestjs/common';
import {
  GroupContentCrudService,
  GroupContentService,
} from './group-content.service';
import { GroupContentController } from './group-content.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsContent } from './group-content.entity';
import { UsersModule } from 'src/users/users.module';
import { ContentModule } from 'src/content/content.module';

@Module({
  providers: [GroupContentService, GroupContentCrudService],
  controllers: [GroupContentController],
  imports: [TypeOrmModule.forFeature([GroupsContent]), UsersModule],
  exports: [GroupContentService, GroupContentCrudService],
})
export class GroupContentModule {}
