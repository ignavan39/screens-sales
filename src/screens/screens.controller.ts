import { Body, Controller, UseGuards, ValidationPipe } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import {
  CreateScreenDto,
  FindByEventDto,
  UpdateScreenDto,
} from './dto/screen.dto';
import { Screen } from './entity/screen.entity';
import {
  ScreenOwnerByEventGuard,
  ScreenOwnerGuard,
} from './guards/owner.guard';
import { ScreensCrudService, ScreensService } from './screens.service';

@Crud({
  model: {
    type: Screen,
  },
  dto: {
    create: CreateScreenDto,
    update: UpdateScreenDto,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  routes: {
    createOneBase: {
      decorators: [
        UseGuards(ScreenOwnerByEventGuard),
        ApiBody({ type: CreateScreenDto }),
      ],
      returnShallow: true,
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
      returnShallow: true,
    },
    deleteOneBase: {
      decorators: [
        UseGuards(ScreenOwnerGuard),
        ApiParam({ name: 'id', type: 'uuid' }),
      ],
      returnDeleted: true,
    },
  },
})
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiTags('screens')
@UseGuards(JwtAuthGuard)
@Controller('screens')
export class ScreensController implements CrudController<Screen> {
  constructor(
    public readonly service: ScreensCrudService,
    public readonly screensService: ScreensService,
  ) {}

  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiOperation({ summary: 'get all event screens' })
  @ApiBody({ type: FindByEventDto })
  @UseGuards(ScreenOwnerByEventGuard)
  @Override()
  async getMany(@Body(new ValidationPipe()) body: FindByEventDto) {
    return this.screensService.findMany(body.eventId);
  }
}
