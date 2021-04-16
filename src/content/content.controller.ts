import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/users/user.decorator';
import { ContentService } from './content.service';
import { CreateContentDto, UpdateContentDto } from './dto/content.dto';

@ApiBearerAuth()
@ApiTags('contents')
@UseGuards(JwtAuthGuard)
@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('/')
  findMany(@User() user) {
    return this.contentService.findManyByUser(user.id);
  }

  @ApiBody({ type: CreateContentDto })
  @Post('/')
  create(@Body() body: CreateContentDto) {
    return this.contentService.save(body);
  }

  @ApiParam({ name: 'id', type: 'uuid' })
  @ApiBody({ type: UpdateContentDto })
  @Put('/:id')
  update(@Param('id') id, @Body() body: UpdateContentDto) {
    return this.contentService.update(body, id);
  }
}
