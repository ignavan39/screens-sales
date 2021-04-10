import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Crud } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
    constructor(
        @InjectRepository(User) userCrudOrmRepo,
        @InjectRepository(User)
        private userRepository: Repository<User>,
      ) {
          super(userCrudOrmRepo)
      }

      async save(username: string,password: string,email: string,fullName?:string): Promise<User> {
          return this.userRepository.save({
              username,
              password,
              email,
              fullName
          })
      }

}
