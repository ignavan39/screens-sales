import { Controller, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AccessGuard } from './access.guard';
import { UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Crud({
  model: {
    type: User,
  },
  dto: {
    update: UpdateUserDto,
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'deleteOneBase', 'updateOneBase'],
    getOneBase: {
      decorators: [
        UseGuards(AccessGuard),
        ApiResponse({
          status: 200,
          schema: {
            example: {
              id: 'id',
              email: 'example@mail.com',
              username: 'example',
              password: 'password',
              fullName: null,
            },
          },
        }),
      ],
    },
    deleteOneBase: {
      decorators: [
        UseGuards(AccessGuard),
        ApiResponse({
          status: 200,
          schema: {
            example: {
              id: 'id',
              email: 'example@mail.com',
              username: 'example',
              password: 'password',
              fullName: null,
            },
          },
        }),
      ],
    },
    updateOneBase: {
      decorators: [
        UseGuards(AccessGuard),
        ApiResponse({
          status: 200,
          schema: {
            example: [
              {
                id: 'id',
                email: 'example@mail.com',
                username: 'example',
                password: 'password',
                fullName: null,
              },
            ],
          },
        }),
      ],
    },
  },
})
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiBearerAuth()
@ApiTags('Auth')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public readonly service: UsersService) {}
}
