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
import { CheckEventExsists } from 'src/events/event.pipe';
import { CreateScreenDto, FindByEventDto, UpdateScreenDto } from './screen.dto';
import { Screen } from './screen.entity';
import { ScreenOwnerByEventGuard, ScreenOwnerGuard } from './owner.guard';
import { ScreensCrudService, ScreensService } from './screens.service';
import { Cookies } from 'src/common/cookie.decorator';
import { Auth0Guard } from 'src/auth/auth.guard';

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
@UseGuards(Auth0Guard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('screens')
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
  async getMany(
    @Body(new ValidationPipe()) body: FindByEventDto,
    // REVU: для чего это?
    @Cookies() cookies,
  ) {
    console.log(cookies);
    return this.screensService.findMany(body.eventId);
  }
}
