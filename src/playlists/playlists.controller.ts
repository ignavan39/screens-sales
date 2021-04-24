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
import {
  InsertContentDto,
  MoveIncludeContentDto,
  UpdateDurationDto,
} from 'src/content/content.dto';
import { Content } from 'src/content/content.entity';
import { CheckScreenExsists } from 'src/screens/screen.pipe';
import { User } from 'src/users/user.decorator';
import { CreatePlaylistDto, UpdatePlaylistDto } from './playlists.dto';
import { Playlist } from './playlist.entity';
import { PlaylistOwnerGuard } from './playlist.guard';
import { PlaylistCrudService, PlaylistService } from './playlists.service';
import { Auth0Guard } from 'src/auth/auth.guard';

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
              id: 'id',
              description: 'description',
              name: 'name',
              screenId: 'id',
              duration: null,
              userId: 'id',
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
              id: 'id',
              description: 'description',
              name: 'name',
              screenId: 'id',
              duration: null,
              userId: 'id',
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
              id: 'id',
              description: 'description',
              name: 'name',
              screenId: 'id',
              duration: null,
              userId: 'id',
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
@UseGuards(Auth0Guard)
@ApiResponse({ status: 403, description: 'Forbidden.' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiBearerAuth()
@ApiTags('playlists')
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
          id: 'id',
          email: 'example@gmail.com',
          username: 'example',
          password: 'password',
          fullName: null,
        },
        name: 'name',
        description: 'description',
        screenId: 'id',
        duration: null,
        id: 'id',
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
          contentId: 'id',
          duration: null,
          playlistId: 'id',
          content: {
            id: 'id',
            contentType: 'Video',
            name: 'name',
            userId: 'id',
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

  @ApiParam({ name: 'id', type: 'uuid' })
  @ApiParam({ name: 'contentId', type: 'uuid' })
  @ApiOperation({ summary: 'change content duration' })
  @ApiBody({ type: UpdateDurationDto })
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
          id: 'id',
          description: 'description',
          name: 'name',
          screenId: 'id',
          duration: null,
          userId: 'id',
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
