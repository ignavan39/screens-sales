import { Body, Controller, UseGuards } from '@nestjs/common';
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
      decorators: [UseGuards(GroupContentOwnerGuard)],
    },
    updateOneBase: {
      decorators: [UseGuards(GroupContentOwnerGuard)],
    },
    deleteOneBase: {
      decorators: [UseGuards(GroupContentOwnerGuard)],
    },
  },
})
@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupContentController implements CrudController<GroupsContent> {
  constructor(
    public readonly service: GroupContentCrudService,
    private readonly groupContentService: GroupContentService,
  ) {}

  @Override('createOneBase')
  create(@User('id') userId, @Body() body: CreateGroupDto) {
    return this.groupContentService.save(body, userId);
  }

  @Override('getManyBase')
  findMany(@User('id') userId) {
    return this.groupContentService.findMany(userId);
  }
}
