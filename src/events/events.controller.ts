import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/users/user.decorator';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { Event } from './entity/event.entity';
import { EventsCrudService, EventsService } from './events.service';
import { EventOwnerGuard } from './guards/event-owner.guard';


@Crud({
    model:{
        type: Event
    },
    params:{
        id: {
            field: 'id',
            type: 'uuid',
            primary: true,
          }
    },
    routes:{
        updateOneBase:{
            decorators:[UseGuards(EventOwnerGuard)],
            returnShallow: true
        },
        deleteOneBase:{
            decorators:[UseGuards(EventOwnerGuard)],
            returnDeleted: true
        },
        getOneBase:{
            decorators:[UseGuards(EventOwnerGuard)]
        }
    },
    dto: {
        create: CreateEventDto,
        update: UpdateEventDto
    }
})
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController implements CrudController<Event>{
    constructor(public readonly service: EventsCrudService,private readonly customService: EventsService){}

    @Override()
    getMany(@User() user){
        return this.customService.findMany(user.id)
    }

    @Override()
    getOne(@ParsedRequest() req, @User() user){
        return this.customService.findOne(req.parsed.paramsFilter[0].value,user.id)
    }
}
