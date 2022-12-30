import 'reflect-metadata';

import { routingConfigs } from 'config/routing-config';
import { useMiddlewares } from 'config/server-middlewares';
import * as dotenv from 'dotenv';
import Koa from 'koa';
import { useContainer, useKoaServer } from 'routing-controllers';
import { getConfig } from 'src/utils/config';
import { useRepositories } from 'config/repositories-config';
import datasource from 'config/data-source';

dotenv.config();

async function bootstrap() {
  try {
    await datasource.initialize();
  } catch (e) {
    console.error('Error during Data Source initialization', e);
  }

  const config = getConfig();
  const koa: Koa = new Koa();

  useMiddlewares(koa);
  // DI from typedi
  const containerWithRepositories = useRepositories();
  useContainer(containerWithRepositories);

  const app: Koa = useKoaServer<Koa>(koa, routingConfigs);

  // TODO: Register cron jobs
  // cron.start();

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

void bootstrap();
