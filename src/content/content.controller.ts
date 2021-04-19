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
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CheckPlaylistExsist } from 'src/playlists/pipes/playlist.pipe';
import { User } from 'src/users/user.decorator';
import { ContentService } from './content.service';
import { CreateContentDto, UpdateContentDto } from './dto/content.dto';
import { Content } from './entity/content.entity';
import { ContentOwnerGuard } from './guards/content.guard';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiBearerAuth()
@ApiTags('contents')
@UseGuards(JwtAuthGuard)
@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 'e2eec7f0-096d-4a5b-9c92-2017c07208c8',
          contentType: 'Video',
          name: '12345',
          userId: '9fed7552-bda8-4e5b-823c-ed2929749ee0',
        },
        {
          id: 'eae1c35c-5fea-4855-8ed3-e2fc5ed33b33',
          contentType: 'Video',
          name: '12345',
          userId: '9fed7552-bda8-4e5b-823c-ed2929749ee0',
        },
      ],
    },
  })
  @ApiOperation({ summary: 'find all user contents' })
  @Get()
  findMany(@User() user) {
    return this.contentService.findManyByUser(user.id);
  }

  @ApiResponse({
    status: 200,
    schema: {
      example: {
        playlistId: 'a4c401bb-048f-4bd1-a582-58f52168231b',
        order: 13,
        duration: null,
        id: 'de92e7fd-9a79-4dd5-81a6-04f8ea51588b',
        name: '12345',
        userId: '9fed7552-bda8-4e5b-823c-ed2929749ee0',
        contentType: 'Video',
      },
    },
  })
  @ApiOperation({ summary: 'create content' })
  @ApiBody({ type: CreateContentDto })
  @Post()
  create(@Body(CheckPlaylistExsist) body: CreateContentDto) {
    return this.contentService.save(body);
  }

  @ApiResponse({
    status: 200,
    schema: {
      example: {
        playlistId: 'a4c401bb-048f-4bd1-a582-58f52168231b',
        order: 13,
        duration: null,
        id: 'de92e7fd-9a79-4dd5-81a6-04f8ea51588b',
        name: '12345',
        userId: '9fed7552-bda8-4e5b-823c-ed2929749ee0',
        contentType: 'Video',
      },
    },
  })
  @ApiOperation({ summary: 'update content' })
  @UseGuards(ContentOwnerGuard)
  @ApiParam({ name: 'id', type: 'uuid' })
  @ApiBody({ type: UpdateContentDto })
  @Put(':id')
  update(
    @Param('id') contentId: Content['id'],
    @Body() body: UpdateContentDto,
  ) {
    return this.contentService.update(body, contentId);
  }
}
