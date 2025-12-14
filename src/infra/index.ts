import cors from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { env } from '@/infra/env';
import { betterAuthPlugin } from './http/plugins/better-auth';
import { openApiPlugin } from './http/plugins/openapi';
import { auth } from './lib/auth';

const app = new Elysia()
  .use(openApiPlugin)
  .use(betterAuthPlugin)
  .use(
    cors({
      origin: env.CLIENT_URL,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )
  .mount(auth.handler)
  .get('/', () => 'Hello Elysia')
  .listen(env.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
