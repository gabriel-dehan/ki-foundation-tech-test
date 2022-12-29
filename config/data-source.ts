import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

// Don't forget to set NODE_ENV before calling this CLI
dotenv.config({ path: path.resolve(__dirname, './../.env') });

const database = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL as string,
  ssl: process.env.NODE_ENV === 'production' ? true : false,
  synchronize: process.env.NODE_ENV === 'production' ? false : true,
  logging: process.env.NODE_ENV === 'development' ? true : false,
  entities: [path.join(__dirname, './../../src/**/*.model.ts')],
  migrations: [path.join(__dirname, './../../src/migrations/*.ts')],
  subscribers: [],
});

export default database;
