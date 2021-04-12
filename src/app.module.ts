import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './ormconfig';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CrudConfigService } from '@nestjsx/crud';
import { EventsModule } from './events/events.module';

CrudConfigService.load({
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  routes: {
    updateOneBase: {
      allowParamsOverride: true,
    },
  },
});

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), AuthModule, UsersModule, EventsModule],
  controllers: [],
})
export class AppModule {}
