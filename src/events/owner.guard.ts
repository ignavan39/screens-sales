import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventsService } from './events.service';

@Injectable()
export class EventOwnerGuard implements CanActivate {
  constructor(
    @Inject('EventsService') private readonly eventsService: EventsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.oidc.user.sub;
    const eventId = request.params.id;
    const event = await this.eventsService.findOne(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return userId === event.userId;
  }
}
