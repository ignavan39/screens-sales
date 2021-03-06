import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Express } from 'express';
import { User } from 'src/users/user.decorator';
import { ContentService } from './content.service';
import {
  AddContentIntoGroup,
  CreateContentDto,
  UpdateContentDto,
} from './content.dto';
import { Content } from './content.entity';
import { ContentOwnerGuard } from './content.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth0Guard } from 'src/auth/auth.guard';
import { CheckContentTypePipe } from './content.pipe';

@UseGuards(Auth0Guard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiBearerAuth()
@ApiTags('contents')
@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 'id',
          contentType: 'Video',
          name: 'name',
          userId: 'id',
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
        playlistId: 'id',
        order: 13,
        duration: null,
        id: 'id',
        name: 'name',
        userId: 'id',
        contentType: 'Video',
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'create content' })
  @ApiBody({ type: CreateContentDto })
  @Post()
  create(
    @Body() body: CreateContentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.contentService.save(body, file.buffer);
  }

  @ApiResponse({
    status: 200,
    schema: {
      example: {
        playlistId: 'id',
        order: 13,
        duration: null,
        id: 'id',
        name: 'name',
        userId: 'id',
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

  @UsePipes(CheckContentTypePipe)
  @UseGuards(ContentOwnerGuard)
  @Put(':id/addGroup')
  addIntoGroup(
    @Param('id') contentId: Content['id'],
    @Body() body: AddContentIntoGroup,
  ) {
    return this.contentService.addContentIntoGroup(body.groupId, contentId);
  }

  @ApiParam({ name: 'id', type: 'uuid' })
  @ApiOperation({ summary: 'delete content by id' })
  @UseGuards(ContentOwnerGuard)
  @Delete(':id')
  delete(@Param('id') contentId: Content['id']) {
    return this.contentService.delete(contentId);
  }

  @ApiOperation({ summary: 'get one content' })
  @ApiParam({ name: 'id', type: 'uuid' })
  @UseGuards(ContentOwnerGuard)
  @Get(':id')
  findOne(@Param('id') id: Content['id']) {
    return this.contentService.findOne(id);
  }
}
