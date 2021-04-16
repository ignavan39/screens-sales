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
import { Content } from './entity/content.entity';

@ApiBearerAuth()
@ApiTags('contents')
@UseGuards(JwtAuthGuard)
@Controller('contents')
export class ContentController {
  constructor(private readonly customService: ContentService) {}

  @Get('/')
  findMany(@User() user) {
    return this.customService.findManyByUser(user.id);
  }

  @ApiBody({ type: CreateContentDto })
  @Post('/')
  create(@Body() body: CreateContentDto) {
    return this.customService.save(body);
  }

  @ApiParam({ name: 'id', type: 'uuid' })
  @ApiBody({ type: UpdateContentDto })
  @Put('/:id')
  update(@Param('id') id, @Body() body: UpdateContentDto) {
    return this.customService.update(body, id);
  }
}
