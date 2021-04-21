import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventsService } from 'src/events/events.service';
import { ScreensCrudService } from './screens.service';

@Injectable()
export class ScreenOwnerByEventGuard implements CanActivate {
  constructor(
    @Inject('EventsService') private readonly eventsService: EventsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const { eventId } = request.body;
    const event = await this.eventsService.findOne(eventId);
    if (!event) {
      throw new NotFoundException('Screens not found');
    }
    return userId === event.userId;
  }
}

@Injectable()
export class ScreenOwnerGuard implements CanActivate {
  constructor(
    @Inject('ScreensCrudService')
    private readonly screensService: ScreensCrudService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const screnId = request.param.id;
    const screen = await this.screensService.findOne(screnId);
    if (!screen) {
      throw new NotFoundException('Screen not found');
    }
    return userId === screen.userId;
  }
}
