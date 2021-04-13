import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { EventsService } from '../events.service';

@Injectable()
export class CheckEventExsists implements PipeTransform {
  constructor(
    @Inject('EventsService') private readonly eventsService: EventsService,
  ) {}

  async transform(value, metadata: ArgumentMetadata) {
    const event = await this.eventsService.findOne(
      value.parsed.paramsFilter[0].value,
    );
    if (!event) {
      throw new BadRequestException('Event dont exsist');
    }
    return value;
  }
}
