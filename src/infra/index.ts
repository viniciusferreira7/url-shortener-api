import { cors } from '@elysiajs/cors';
import openapi from '@elysiajs/openapi';
import { Elysia } from 'elysia';
import { env } from '@/infra/env';
import { auth } from './lib/auth';

const app = new Elysia()
  .use(openapi()) //FIXME: add better auth config to work with openapi
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
