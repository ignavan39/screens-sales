import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ScreensCrudService } from '../screens.service';

@Injectable()
export class CheckScreenExsists implements PipeTransform {
  constructor(
    @Inject('ScreensCrudService')
    private readonly screenService: ScreensCrudService,
  ) {}

  async transform(value, metadata: ArgumentMetadata) {
    const screen = await this.screenService.findOne(
      value.parsed.paramsFilter[0].value,
    );
    if (!screen) {
      throw new BadRequestException('Screen dont exsist');
    }
    return value;
  }
}
