import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from '../dto/sign-up.dto';

@Injectable()
export class CheckUserExsists implements PipeTransform {
  constructor(
    @Inject('UsersService') private readonly usersService: UsersService,
  ) {}

  async transform(value: SignUpDto, metadata: ArgumentMetadata) {
    console.log(value);
    const user = await this.usersService.findOne({ email: value.email });
    if (user) {
      throw new BadRequestException('User with email already exsist');
    }
    return value;
  }
}
