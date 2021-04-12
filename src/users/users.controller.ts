import { Controller, UseGuards } from '@nestjs/common';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AccessGuard } from './access.guard';
import { UpdateUserDto } from './dto/user.dto';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';

@Crud({
  model: {
    type: User,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: UpdateUserDto,
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'deleteOneBase', 'updateOneBase'],
    getOneBase: {
      decorators: [UseGuards(AccessGuard)],
    },
    deleteOneBase: {
      decorators: [UseGuards(AccessGuard)],
    },
    updateOneBase: {
      decorators: [UseGuards(AccessGuard)],
    },
  },
})
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public readonly service: UsersService) {}
}
