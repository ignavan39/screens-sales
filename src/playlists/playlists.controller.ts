import { Body, Controller, Param, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/users/user.decorator';
import { CreatePlaylistDto } from './dto/playlists.dto';
import { Playlist } from './entity/playlist.entity';
import { PlaylistOwnerGuard } from './guards/playlist.guard';
import { CheckPlaylistExsist } from './pipes/playlist.pipe';
import { PlaylistCrudService, PlaylistService } from './playlists.service';

@Crud({
    model:{
        type: Playlist
    },
    params: {
        id: {
            field: 'id',
            type: 'uuid',
            primary: true,
          },
    },
    routes:{
        getOneBase: {
            decorators:[UseGuards(PlaylistOwnerGuard),UsePipes(CheckPlaylistExsist)],
        },
        updateOneBase: {
            decorators: [UseGuards(PlaylistOwnerGuard),UsePipes(CheckPlaylistExsist)],
            returnShallow: true
        },
        deleteOneBase: {
            decorators: [UseGuards(PlaylistOwnerGuard),UsePipes(CheckPlaylistExsist)],
            returnDeleted: true
        }
    }
})
@UseGuards(JwtAuthGuard)
@Controller('playlists')
export class PlaylistsController implements CrudController<Playlist>{
    constructor(
        public readonly service:PlaylistCrudService,
        private readonly customService: PlaylistService
        ){}

    @Override()
    createOne(@Body(new ValidationPipe()) body: CreatePlaylistDto,@User('id') userId){
        return this.customService.save(userId,body)
    }
}
