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
              id: '29615bad-0209-47ca-81e9-4a0d73b98dc1',
              email: 'example@mail.com',
              username: 'example',
              password:
                '$2b$18$Hy9zMiIrjEhvXzCdhP3z2e1GOQPBeznNb93kbM9Xr0cQ/S0s4GK9S',
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
              id: '29615bad-0209-47ca-81e9-4a0d73b98dc1',
              email: 'example@mail.com',
              username: 'example',
              password:
                '$2b$18$Hy9zMiIrjEhvXzCdhP3z2e1GOQPBeznNb93kbM9Xr0cQ/S0s4GK9S',
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
                id: '29615bad-0209-47ca-81e9-4a0d73b98dc1',
                email: 'example@mail.com',
                username: 'example',
                password:
                  '$2b$18$Hy9zMiIrjEhvXzCdhP3z2e1GOQPBeznNb93kbM9Xr0cQ/S0s4GK9S',
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
