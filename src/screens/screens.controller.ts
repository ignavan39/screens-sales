import {
  Body,
  Controller,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CheckEventExsists } from 'src/events/event.pipe';
import { CreateScreenDto, FindByEventDto, UpdateScreenDto } from './screen.dto';
import { Screen } from './screen.entity';
import { ScreenOwnerByEventGuard, ScreenOwnerGuard } from './owner.guard';
import { ScreensCrudService, ScreensService } from './screens.service';

@Crud({
  model: {
    type: Screen,
  },
  dto: {
    create: CreateScreenDto,
    update: UpdateScreenDto,
  },
  routes: {
    createOneBase: {
      decorators: [
        UsePipes(CheckEventExsists),
        ApiBody({ type: CreateScreenDto }),
      ],
    },
    getOneBase: {
      decorators: [
        UseGuards(ScreenOwnerGuard),
        ApiParam({ name: 'id', type: 'uuid' }),
      ],
    },
    updateOneBase: {
      decorators: [
        UseGuards(ScreenOwnerGuard),
        ApiParam({ name: 'id', type: 'uuid' }),
        ApiBody({ type: UpdateScreenDto }),
      ],
    },
    deleteOneBase: {
      decorators: [
        UseGuards(ScreenOwnerGuard),
        ApiParam({ name: 'id', type: 'uuid' }),
      ],
    },
  },
})
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('screens')
@UseGuards(JwtAuthGuard)
@Controller('screens')
export class ScreensController implements CrudController<Screen> {
  constructor(
    public readonly service: ScreensCrudService,
    public readonly screensService: ScreensService,
  ) {}

  @ApiResponse({
    status: 201,
    schema: {
      example: {
        playlistId: 'id',
        description: 'description',
        userId: 'id',
        id: 'id',
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiOperation({ summary: 'get all event screens' })
  @ApiBody({ type: FindByEventDto })
  @UseGuards(ScreenOwnerByEventGuard)
  @Override()
  async getMany(@Body(new ValidationPipe()) body: FindByEventDto) {
    return this.screensService.findMany(body.eventId);
  }
}
