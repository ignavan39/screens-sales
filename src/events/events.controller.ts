import { Body, Controller, Param, UseGuards, UsePipes } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/users/user.decorator';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { Event } from './entity/event.entity';
import { EventsCrudService, EventsService } from './events.service';
import { EventOwnerGuard } from './guards/owner.guard';

@Crud({
  model: {
    type: Event,
  },
  routes: {
    updateOneBase: {
      decorators: [
        UseGuards(EventOwnerGuard),
        ApiBody({ type: UpdateEventDto }),
        ApiParam({ name: 'id', type: 'uuid' }),
      ],
    },
    deleteOneBase: {
      decorators: [
        UseGuards(EventOwnerGuard),
        ApiParam({ name: 'id', type: 'uuid' }),
      ],
    },
    getOneBase: {
      decorators: [
        UseGuards(EventOwnerGuard),
        ApiParam({ name: 'id', type: 'uuid' }),
      ],
    },
  },
  dto: {
    create: CreateEventDto,
    update: UpdateEventDto,
  },
})
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiBearerAuth()
@ApiTags('events')
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController implements CrudController<Event> {
  constructor(
    public readonly service: EventsCrudService,
    private readonly eventsService: EventsService,
  ) {}

  @ApiOperation({ summary: 'create event' })
  @ApiBody({ type: CreateEventDto })
  @Override('createOneBase')
  create(@User() user, @Body() createDto: CreateEventDto) {
    return this.eventsService.save(user.id, createDto);
  }

  @ApiOperation({ summary: 'get all events' })
  @Override()
  getMany(@User() user) {
    return this.eventsService.findMany(user.id);
  }
}
