import { Body, Controller, Param, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/users/user.decorator';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { Event } from './entity/event.entity';
import { EventsCrudService, EventsService } from './events.service';
import { EventOwnerGuard } from './guards/owner.guard';
import { CheckEventExsists } from './pipes/event.pipe';

@Crud({
  model: {
    type: Event,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  routes: {
    updateOneBase: {
      decorators: [
        UseGuards(EventOwnerGuard),
        UsePipes(CheckEventExsists),
        ApiBody({ type: UpdateEventDto }),
        ApiParam({ name: 'id', type: 'uuid' }),
      ],
      returnShallow: true,
    },
    deleteOneBase: {
      decorators: [
        UseGuards(EventOwnerGuard),
        UsePipes(CheckEventExsists),
        ApiParam({ name: 'id', type: 'uuid' }),
      ],
      returnDeleted: true,
    },
    getOneBase: {
      decorators: [
        UseGuards(EventOwnerGuard),
        UsePipes(CheckEventExsists),
        ApiParam({ name: 'id', type: 'uuid' }),
      ],
    },
  },
  dto: {
    create: CreateEventDto,
    update: UpdateEventDto,
  },
})
@ApiBearerAuth()
@ApiTags('events')
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController implements CrudController<Event> {
  constructor(
    public readonly service: EventsCrudService,
    private readonly customService: EventsService,
  ) {}

  @ApiBody({ type: CreateEventDto })
  @Override('createOneBase')
  create(@User() user, @Body() createDto: CreateEventDto) {
    return this.customService.save(user.id, createDto);
  }
  //for admin
  @Override()
  getMany(@User() user) {
    return this.customService.findMany(user.id);
  }
}
