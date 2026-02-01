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
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'VALIDATION':
        set.status = 400;
        return {
          message: 'Validation error',
          errors: error.message,
        };
      case 'NOT_FOUND':
        set.status = 404;
        return {
          message: 'Route not found',
        };
      case 'INTERNAL_SERVER_ERROR':
        console.error('Internal server error:', error);
        set.status = 500;
        return {
          message: 'Internal server error',
        };
      default:
        console.error('Unhandled error:', error);
        set.status = 500;
        return {
          message: 'An unexpected error occurred',
        };
    }
  })
  .use(authControllers)
  .use(publicControllers)
  .listen(env.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
