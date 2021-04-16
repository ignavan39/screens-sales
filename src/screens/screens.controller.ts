import {
  Body,
  Controller,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
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
import { CheckScreenExsists } from './pipes/screen.pipe';
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
        UsePipes(CheckScreenExsists),
        ApiParam({ name: 'id', type: 'uuid' }),
      ],
    },
    updateOneBase: {
      decorators: [
        UseGuards(ScreenOwnerGuard),
        UsePipes(CheckScreenExsists),
        ApiParam({ name: 'id', type: 'uuid' }),
        ApiBody({ type: UpdateScreenDto }),
      ],
      returnShallow: true,
    },
    deleteOneBase: {
      decorators: [
        UseGuards(ScreenOwnerGuard),
        UsePipes(CheckScreenExsists),
        ApiParam({ name: 'id', type: 'uuid' }),
      ],
      returnDeleted: true,
    },
  },
})
@ApiTags('screens')
@UseGuards(JwtAuthGuard)
@Controller('screens')
export class ScreensController implements CrudController<Screen> {
  constructor(
    public readonly service: ScreensCrudService,
    public readonly customService: ScreensService,
  ) {}

  @ApiBody({ type: FindByEventDto })
  @UseGuards(ScreenOwnerByEventGuard)
  @Override()
  async getMany(@Body(new ValidationPipe()) body: FindByEventDto) {
    return this.customService.findMany(body.eventId);
  }
}
