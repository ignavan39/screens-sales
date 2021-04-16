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
import { User } from 'src/users/user.decorator';
import { ContentService } from './content.service';
import { CreateContentDto, UpdateContentDto } from './dto/content.dto';
import { ContentOwnerGuard } from './guards/content.guard';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiBearerAuth()
@ApiTags('contents')
@UseGuards(JwtAuthGuard)
@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiOperation({ summary: 'find all user contents' })
  @Get()
  findMany(@User() user) {
    return this.contentService.findManyByUser(user.id);
  }

  @ApiOperation({ summary: 'create content' })
  @ApiBody({ type: CreateContentDto })
  @Post()
  create(@Body() body: CreateContentDto) {
    return this.contentService.save(body);
  }

  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiOperation({ summary: 'update content' })
  @UseGuards(ContentOwnerGuard)
  @ApiParam({ name: 'id', type: 'uuid' })
  @ApiBody({ type: UpdateContentDto })
  @Put(':id')
  update(@Param('id') contentId, @Body() body: UpdateContentDto) {
    return this.contentService.update(body, contentId);
  }
}
