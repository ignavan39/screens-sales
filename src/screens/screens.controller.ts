import { Body, Controller, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateScreenDto, FindByEventDto, UpdateScreenDto } from './dto/screen.dto';
import { Screen } from './entity/screen.entity';
import { ScreenOwnerByEventGuard, ScreenOwnerGuard } from './guards/screen-owner.guard';
import { CheckScreenExsists } from './pipes/exsist-screen.pipe';
import { ScreensCrudService, ScreensService } from './screens.service';

@Crud({
    model: {
        type: Screen
    },
    dto: {
        create: CreateScreenDto,
        update: UpdateScreenDto
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
              decorators: [UseGuards(ScreenOwnerByEventGuard)],
              returnShallow: true
          },
          getOneBase:{
            decorators:[UseGuards(ScreenOwnerGuard),UsePipes(CheckScreenExsists)]
          },
          updateOneBase: {
            decorators: [UseGuards(ScreenOwnerGuard),UsePipes(CheckScreenExsists)],
            returnShallow: true
          },
          deleteOneBase: {
              decorators: [UseGuards(ScreenOwnerGuard),UsePipes(CheckScreenExsists)],
              returnDeleted: true
          },
      }
})
@UseGuards(JwtAuthGuard)
@Controller('screens')
export class ScreensController implements CrudController<Screen>{
    constructor(
        public readonly service: ScreensCrudService,
        public readonly customService: ScreensService
        ){}

    @UseGuards(ScreenOwnerByEventGuard)
    @Override()
    async getMany(@Body(new ValidationPipe()) body: FindByEventDto){
        return this.customService.findMany(body.eventId)
    }
}
