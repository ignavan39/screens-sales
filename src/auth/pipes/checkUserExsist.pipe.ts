import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CheckUserExsists implements PipeTransform {
  constructor(
    @Inject('UsersService') private readonly usersService: UsersService,
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const user = await this.usersService.findOne({ email: value.email });
    if (user) {
      throw new BadRequestException('User with email already exsist');
    }
    return value;
  }
}
