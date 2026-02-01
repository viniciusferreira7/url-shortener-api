import cors from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { env } from '@/infra/env';
import { openApiPlugin } from '../../plugins/openapi';
import { healthController } from './health-controller';

export const publicControllers = new Elysia()
  .use(openApiPlugin)
  .use(
    cors({
      origin: env.CLIENT_URL,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )
  .use(healthController);
