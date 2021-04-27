import {
  Injectable,
  PipeTransform,
  Inject,
  ArgumentMetadata,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { GroupContentService } from './group-content.service';

@Injectable()
export class CheckGroupExsist implements PipeTransform {
  constructor(
    @Inject('GroupContentService')
    private readonly groupContentService: GroupContentService,
  ) {}

  async transform(value, metadata: ArgumentMetadata) {
    if (metadata.type === 'param') {
      const group = await this.groupContentService.findOne(value.id);
      if (!group) {
        throw new NotFoundException('group dont exsist');
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
