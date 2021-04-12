import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Override } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { Event } from './entity/event.entity';

@Injectable()
export class EventsCrudService extends TypeOrmCrudService<Event> {
  constructor(
    @InjectRepository(Event)
    eventRepository: Repository<Event>,
    @InjectRepository(Event)
    private eventCustomRepository: Repository<Event>
  ) {
    super(eventRepository);
  }

}

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private eventsRepository: Repository<Event>
    ){}
    
    async findMany(userId: User['id']): Promise<Event[]>{
        return this.eventsRepository.find({
            where: {userId}
        })
      }
    
      async findOne(id: Event['id']): Promise<Event|null> {
          return this.eventsRepository.findOne({
              where:{
                  id
              }
          })
      }
   
}