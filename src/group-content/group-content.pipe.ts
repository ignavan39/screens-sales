import {
  PipeTransform,
  Inject,
  ArgumentMetadata,
  NotFoundException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateContentDto } from 'src/content/content.dto';
import { ContentService } from 'src/content/content.service';
import { GroupContentService } from './group-content.service';

@Injectable()
export class CheckGroupExsist implements PipeTransform {
  constructor(
    @Inject('GroupContentService')
    private readonly groupContentService: GroupContentService,
    private readonly contentService: ContentService,
  ) {}

  async transform(value: CreateContentDto, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      const group = await this.groupContentService.findOne(value.groupId);
      if (!group) {
        throw new NotFoundException('Group not found');
      }
    }
    return value;
  }
}

@Injectable()
export class CheckGroupIsNotEmptyPipe implements PipeTransform {
  constructor(
    @Inject('GroupContentService')
    private readonly groupContentService: GroupContentService,
  ) {}

  async transform(value, metadata: ArgumentMetadata) {
    if (metadata.type === 'param') {
      const group = await this.groupContentService.findOne(value.id);
      if (group.contents.length === 0) {
        throw new BadRequestException('group is empty');
      }
    }
    return value;
  }
}
