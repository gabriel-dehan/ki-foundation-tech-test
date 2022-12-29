import Koa from 'koa';
import logger from 'koa-logger';
import helmet from 'koa-helmet';
import jwt from 'koa-jwt';
import bodyParser from 'koa-bodyparser';
import { isProd, getConfig } from 'src/utils/config';
import cors from '@koa/cors';

export const useMiddlewares = <T extends Koa>(app: T): T => {
  const config = getConfig();

  if (isProd()) {
    app.use(logger());
  }

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  app.use(bodyParser());

  app.use(cors());

  app.use(jwt({ secret: config.authSecret, passthrough: true }));

  return app;
};
