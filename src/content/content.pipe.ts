import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Content } from './content.entity';
import { ContentService } from './content.service';

@Injectable()
export class CheckContentTypePipe implements PipeTransform {
  constructor(
    @Inject('ContentService') private readonly contentService: ContentService,
  ) {}
  async transform(value: Content['id'], metadata: ArgumentMetadata) {
    if (metadata.type === 'param') {
      const content = await this.contentService.findOne(value);
      if (content.contentType !== 'Video') {
        throw new BadRequestException('Failed type');
      }
    }
    return value;
  }
}
