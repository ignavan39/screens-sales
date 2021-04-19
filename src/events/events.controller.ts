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
        ApiResponse({
          status: 200,
          schema: {
            example: {
              id: '8c9163fe-b6e1-49e5-a194-035409de304d',
              description: '12345',
              userId: '9fed7552-bda8-4e5b-823c-ed2929749ee0',
            },
          },
        }),
      ],
    },
    deleteOneBase: {
      decorators: [
        UseGuards(EventOwnerGuard),
        ApiParam({ name: 'id', type: 'uuid' }),
        ApiResponse({
          status: 200,
          schema: {
            example: {
              playlistId: 'a4c401bb-048f-4bd1-a582-58f52168231b',
              description: 'description',
              userId: '29615bad-0209-47ca-81e9-4a0d73b98dc9',
            },
          },
        }),
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
@ApiResponse({ status: 403, description: 'Forbidden' })
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
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        userId: '9fed7552-bda8-4e5b-823c-ed2929749ee0',
        description: 'example',
        id: '8a418430-523f-49aa-8620-7142490102a4',
      },
    },
  })
  @ApiBody({ type: CreateEventDto })
  @Override('createOneBase')
  create(@User() user, @Body() createDto: CreateEventDto) {
    return this.eventsService.save(user.id, createDto);
  }

  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: '6fb9a764-b455-4cf8-b103-c146e6541529',
          description: 'example1',
          userId: '9fed7552-bda8-4e5b-823c-ed2929749ee0',
        },
        {
          id: '6fb9a764-b455-4cf8-b103-c146e6541521',
          description: 'example2',
          userId: '9fed7552-bda8-4e5b-823c-ed2929749ee0',
        },
      ],
    },
  })
  @ApiOperation({ summary: 'get all events' })
  @Override()
  getMany(@User() user) {
    return this.eventsService.findMany(user.id);
  }
}
