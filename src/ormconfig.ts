import {ConnectionOptions} from 'typeorm';
require('dotenv').config()

export const ormConfig: ConnectionOptions = {
    type: 'postgres',
    host:process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    migrationsRun: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
}