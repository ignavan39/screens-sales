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
import { Auth0Guard } from 'src/auth/auth.guard';
import { User } from 'src/users/user.decorator';
import { CreateEventDto, UpdateEventDto } from './event.dto';
import { Event } from './event.entity';
import { EventsCrudService, EventsService } from './events.service';
import { EventOwnerGuard } from './events.guard';

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
              id: 'id',
              description: 'description',
              userId: 'id',
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
              playlistId: 'id',
              description: 'description',
              userId: 'id',
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
@UseGuards(Auth0Guard)
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
        userId: 'id',
        description: 'description',
        id: 'id',
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
          id: 'id',
          description: 'description',
          userId: 'id',
        },
        {
          id: 'id',
          description: 'description',
          userId: 'id',
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
