import cors from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { env } from '@/infra/env';
import { privateControllers } from './http/controllers/private';
import { publicControllers } from './http/controllers/public';
import { openApiPlugin } from './http/plugins/openapi';

const app = new Elysia({ prefix: 'api' })
  .use(openApiPlugin)
  .use(
    cors({
      origin: env.CLIENT_URL,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )
  .use(privateControllers)
  .use(publicControllers)
  .listen(env.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
