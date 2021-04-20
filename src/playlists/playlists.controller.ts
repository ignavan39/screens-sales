import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
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
import {
  InsertContentDto,
  MoveIncludeContentDto,
  UpdateDurationDto,
} from 'src/content/dto/content.dto';
import { Content } from 'src/content/entity/content.entity';
import { CheckScreenExsists } from 'src/screens/pipes/screen.pipe';
import { User } from 'src/users/user.decorator';
import { CreatePlaylistDto, UpdatePlaylistDto } from './dto/playlists.dto';
import { Playlist } from './entity/playlist.entity';
import { PlaylistOwnerGuard } from './guards/playlist.guard';
import { PlaylistCrudService, PlaylistService } from './playlists.service';

@Crud({
  model: {
    type: Playlist,
  },
  routes: {
    getOneBase: {
      decorators: [
        UseGuards(PlaylistOwnerGuard),
        ApiResponse({
          status: 200,
          schema: {
            type: 'Playlist',
            example: {
              id: 'd8e8b47a-057a-44c2-9875-2fcb300c6fe3',
              description: '123456',
              name: 'name',
              screenId: '1317efdb-0c6f-4a1a-ab7a-c0e4f5236ce3',
              duration: null,
              userId: '9fed7552-bda8-4e5b-823c-ed2929749ee0',
            },
          },
        }),
      ],
    },
    updateOneBase: {
      decorators: [
        UseGuards(PlaylistOwnerGuard),
        ApiResponse({
          status: 200,
          schema: {
            type: 'Playlist',
            example: {
              id: 'd8e8b47a-057a-44c2-9875-2fcb300c6fe3',
              description: '123456',
              name: 'name',
              screenId: '1317efdb-0c6f-4a1a-ab7a-c0e4f5236ce3',
              duration: null,
              userId: '9fed7552-bda8-4e5b-823c-ed2929749ee0',
            },
          },
        }),
      ],
    },
    deleteOneBase: {
      decorators: [
        UseGuards(PlaylistOwnerGuard),
        ApiResponse({
          status: 200,
          schema: {
            example: {
              id: 'd8e8b47a-057a-44c2-9875-2fcb300c6fe3',
              description: '123456',
              name: 'name',
              screenId: '1317efdb-0c6f-4a1a-ab7a-c0e4f5236ce3',
              duration: null,
              userId: '9fed7552-bda8-4e5b-823c-ed2929749ee0',
            },
          },
        }),
      ],
    },
  },
  dto: {
    create: CreatePlaylistDto,
    update: UpdatePlaylistDto,
  },
})
@ApiResponse({ status: 403, description: 'Forbidden.' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiBearerAuth()
@ApiTags('playlists')
@UseGuards(JwtAuthGuard)
@Controller('playlists')
export class PlaylistsController implements CrudController<Playlist> {
  constructor(
    public readonly service: PlaylistCrudService,
    private readonly playlistService: PlaylistService,
  ) {}

  @ApiOperation({ summary: 'create playlist' })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        userId: {
          id: '9fed7552-bda8-4e5b-823c-ed2929749ee0',
          email: 'example@gmail.com',
          username: 'example',
          password:
            '$2b$18$w/sw6WAsDYvtT829Bl1A5.VXnbw6LA1Y6ZMHJ/mlQUVz6uGmbR/DC',
          fullName: null,
        },
        name: 'name',
        description: '123456',
        screenId: '1317efdb-0c6f-4a1a-ab7a-c0e4f5236ce3',
        duration: null,
        id: 'd8e8b47a-057a-44c2-9875-2fcb300c6fe3',
      },
    },
  })
  @ApiBody({ type: CreatePlaylistDto })
  @Override()
  createOne(
    @Body(CheckScreenExsists) body: CreatePlaylistDto,
    @User('id') userId,
  ) {
    return this.playlistService.save(userId, body);
  }

  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 1,
          order: 1,
          contentId: 'd35ad620-fd7b-4ff5-85bf-100ea8ef31e9',
          duration: null,
          playlistId: 'd8e8b47a-057a-44c2-9875-2fcb300c6fe3',
          content: {
            id: 'd35ad620-fd7b-4ff5-85bf-100ea8ef31e9',
            contentType: 'Video',
            name: 'example',
            userId: '9fed7552-bda8-4e5b-823c-ed2929749ee0',
          },
        },
        {
          id: 2,
          order: 2,
          contentId: 'd35ad620-fd7b-4ff5-85bf-100ea8ef31e9',
          duration: null,
          playlistId: 'd8e8b47a-057a-44c2-9875-2fcb300c6fe3',
          content: {
            id: 'd35ad620-fd7b-4ff5-85bf-100ea8ef31e9',
            contentType: 'Video',
            name: 'example1',
            userId: '9fed7552-bda8-4e5b-823c-ed2929749ee0',
          },
        },
      ],
    },
  })
  @ApiOperation({ summary: 'get all playlist contents' })
  @ApiParam({ name: 'id', type: 'uuid' })
  @UseGuards(PlaylistOwnerGuard)
  @Get('/:id/contents')
  getContents(@Param('id') playlistId: Playlist['id']) {
    return this.playlistService.findContents(playlistId);
  }

  @ApiOperation({ summary: 'insert content into playlist' })
  @ApiParam({ name: 'id', type: 'uuid' })
  @ApiParam({ name: 'contentId', type: 'uuid' })
  @ApiBody({ type: InsertContentDto })
  @UseGuards(PlaylistOwnerGuard)
  @Put('/:id/contents')
  insertContent(
    @Param('id') playlistId: Playlist['id'],
    @Body() body: InsertContentDto,
  ) {
    return this.playlistService.insertContent(playlistId, body);
  }

  @ApiOperation({ summary: 'change content duration' })
  @Put('/:id/contents/:contentId/duration')
  @UseGuards(PlaylistOwnerGuard)
  changeContentDuration(
    @Param('id') playlistId: Playlist['id'],
    @Param('contentId') contentId: Content['id'],
    @Body() body: UpdateDurationDto,
  ) {
    return this.playlistService.updateDuration(
      playlistId,
      contentId,
      body.duration,
    );
  }

  @ApiOperation({ summary: 'move content into playlists' })
  @ApiParam({ name: 'id', type: 'uuid' })
  @ApiParam({ name: 'contentId', type: 'uuid' })
  @ApiBody({ type: MoveIncludeContentDto })
  @UseGuards(PlaylistOwnerGuard)
  @Post('/:id/contents/:contentId/move')
  moveContent(
    @Param('id') playlistId: Playlist['id'],
    @Param('contentId') contentId: Content['id'],
    @Body() body: MoveIncludeContentDto,
  ) {
    return this.playlistService.moveContent(playlistId, contentId, body);
  }

  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: '501df16d-1b31-4e6a-af62-758f3931b011',
          description: '123456',
          name: 'name',
          screenId: '53a27c26-4fa5-43cc-a44e-242147283924',
          duration: null,
          userId: '9fed7552-bda8-4e5b-823c-ed2929749ee0',
        },
        {
          id: '501df16d-1b31-4e6a-af62-758f3931b011',
          description: '123456',
          name: 'name1',
          screenId: '53a27c26-4fa5-43cc-a44e-242147283924',
          duration: null,
          userId: '9fed7552-bda8-4e5b-823c-ed2929749ee0',
        },
      ],
    },
  })
  @ApiOperation({ summary: 'get all playlist by user' })
  @Override('getManyBase')
  getPlaylistByUserId(@User() user) {
    return this.playlistService.findAllPlaylystByUser(user.id);
  }
}
