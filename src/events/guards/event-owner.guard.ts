import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
  } from '@nestjs/common';
import { EventsService } from '../events.service';
  
  @Injectable()
  export class EventOwnerGuard implements CanActivate {
    constructor(
      @Inject('EventsService') private readonly eventsService: EventsService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const userId = request.user.id;
      const eventId = request.params.id;
      const event = await this.eventsService.findOne(eventId);
      return userId === event.userId;
    }
  }