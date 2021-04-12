import { ArgumentMetadata, BadRequestException, Inject, Injectable, PipeTransform } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { EventsService } from "../events.service";

@Injectable()
export class CheckEventExsists implements PipeTransform {
  constructor(
    @Inject('EventsService') private readonly eventsService: EventsService,
  ) {}

  async transform(value, metadata: ArgumentMetadata) {
    console.log(value)
    const event = await this.eventsService.findOne(value.id ,value.userId);
    if (!event) {
      throw new BadRequestException('Event dont exsist');
    }
    return value;
  }
}
