import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ScreensCrudService } from './screens.service';

@Injectable()
export class CheckScreenExsists implements PipeTransform {
  constructor(
    @Inject('ScreensCrudService')
    private readonly screenService: ScreensCrudService,
  ) {}

  async transform(value, metadata: ArgumentMetadata) {
    if (value.screenId) {
      const screen = await this.screenService.findOne(value.screenId);
      if (!screen) {
        throw new BadRequestException('Screen dont exsist');
      }
    }
    return value;
  }
}
