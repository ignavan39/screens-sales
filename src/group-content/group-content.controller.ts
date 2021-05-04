import { Body, Controller, Param, UseGuards, UsePipes } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { Auth0Guard } from 'src/auth/auth.guard';
import { User } from 'src/users/user.decorator';
import { GroupsContent } from './group-content.entity';
import { GroupContentOwnerGuard } from './group-content.guard';
import {
  GroupContentCrudService,
  GroupContentService,
} from './group-content.service';

@Crud({
  model: {
    type: GroupsContent,
  },
  routes: {
    only: ['deleteOneBase', 'getManyBase', 'getOneBase'],
    getOneBase: {
      decorators: [
        UseGuards(GroupContentOwnerGuard),
        ApiResponse({
          status: 200,
          schema: {
            example: {
              id: 'id',
              name: 'name',
              userId: 'id',
            },
          },
        }),
      ],
    },
    deleteOneBase: {
      decorators: [
        UseGuards(GroupContentOwnerGuard),
        ApiResponse({
          status: 200,
          schema: {
            example: {
              id: 'id',
              userId: 'id',
            },
          },
        }),
      ],
    },
  },
})
@UseGuards(Auth0Guard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiBearerAuth()
@ApiTags('groups')
@Controller('groups')
export class GroupContentController implements CrudController<GroupsContent> {
  constructor(
    public readonly service: GroupContentCrudService,
    private readonly groupContentService: GroupContentService,
  ) {}

  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 'id',
          name: 'name',
          userId: 'id',
        },
      ],
    },
  })
  @ApiOperation({ summary: 'get all content groups' })
  @Override('getManyBase')
  findMany(@User('id') userId) {
    return this.groupContentService.findMany(userId);
  }
}
