import { Body, Controller, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/users/user.decorator';
import { CreateGroupDto, UpdateGroupDto } from './group-content.dto';
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
  dto: {
    create: CreateGroupDto,
    update: UpdateGroupDto,
  },
  routes: {
    only: [
      'createOneBase',
      'deleteOneBase',
      'getManyBase',
      'getOneBase',
      'updateOneBase',
    ],
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
    updateOneBase: {
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
              name: 'name',
              userId: 'id',
            },
          },
        }),
      ],
    },
  },
})
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiBearerAuth()
@ApiTags('groups')
@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupContentController implements CrudController<GroupsContent> {
  constructor(
    public readonly service: GroupContentCrudService,
    private readonly groupContentService: GroupContentService,
  ) {}

  @ApiResponse({
    status: 201,
    schema: {
      example: {
        id: 'id',
        name: 'name',
        userId: 'id',
      },
    },
  })
  @ApiOperation({ summary: 'create content group' })
  @ApiBody({ type: CreateGroupDto })
  @Override('createOneBase')
  create(@User('id') userId, @Body() body: CreateGroupDto) {
    return this.groupContentService.save(body, userId);
  }

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
