import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateContentDto } from './dto/content.dto';
import { Content } from './entity/content.entity';

@Injectable()
export class ContentService {
    constructor(@InjectRepository(Content) private readonly repository: Repository<Content>){}

    async findMany(userId: User['id']):Promise<Content[]> {
        return this.repository.find({
            where: {
                userId
            }
        })
    }

   
}
