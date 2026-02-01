import cors from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { env } from '@/infra/env';
import { authControllers } from './http/controllers/auth';
import { publicControllers } from './http/controllers/public';
import { openApiPlugin } from './http/plugins/openapi';

export const app = new Elysia({ prefix: 'api' })
  .use(openApiPlugin)
  .use(
    cors({
      origin: env.CLIENT_URL,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )
  .use(authControllers)
  .use(publicControllers)
  .listen(env.PORT);
//TODO: create method to validate zod errors

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
