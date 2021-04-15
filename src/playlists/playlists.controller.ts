import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { identity } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { MoveIncludeContentDto } from 'src/content/dto/content.dto';
import { User } from 'src/users/user.decorator';
import { CreatePlaylistDto, UpdatePlaylistDto } from './dto/playlists.dto';
import { Playlist } from './entity/playlist.entity';
import { PlaylistOwnerGuard } from './guards/playlist.guard';
import { CheckContentOrder, CheckPlaylistExsist } from './pipes/playlist.pipe';
import { PlaylistCrudService, PlaylistService } from './playlists.service';

@Crud({
  model: {
    type: Playlist,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  routes: {
    getOneBase: {
      decorators: [
        UseGuards(PlaylistOwnerGuard),
        UsePipes(CheckPlaylistExsist),
      ],
    },
    updateOneBase: {
      decorators: [
        UseGuards(PlaylistOwnerGuard),
        UsePipes(CheckPlaylistExsist),
      ],
      returnShallow: true,
    },
    deleteOneBase: {
      decorators: [
        UseGuards(PlaylistOwnerGuard),
        UsePipes(CheckPlaylistExsist),
      ],
      returnDeleted: true,
    },
  },
  dto: {
    create: CreatePlaylistDto,
    update: UpdatePlaylistDto,
  },
})
@UseGuards(JwtAuthGuard)
@Controller('playlists')
export class PlaylistsController implements CrudController<Playlist> {
  constructor(
    public readonly service: PlaylistCrudService,
    private readonly customService: PlaylistService,
  ) {}

  @Override()
  createOne(
    @Body(new ValidationPipe()) body: CreatePlaylistDto,
    @User('id') userId,
  ) {
    return this.customService.save(userId, body);
  }

  @Get("/:id/contents")
  getIncludeContents(@Param('id') id){
    return this.customService.findIncludeContent(id)
  }

  @Post('/:id/contents/:contentId')
  insertContent(@Param('id') id,@Param("contentId") contentId){
    return this.customService.insertContent(id,contentId)
  }


  @UsePipes(CheckContentOrder)
  @Post("/:id/contents/:contentId/move")
  moveIncludeContent(@Param('id') id, @Param("contentId") contentId,@Body() body:MoveIncludeContentDto){
    return this.customService.moveContent(id,contentId,body)
  }
}
