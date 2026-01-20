import { Elysia } from 'elysia';
import { auth } from '@/infra/lib/auth';
import { createUrlController } from './create-url-controller';

export const authControllers = new Elysia()
  .use(createUrlController)
  .mount(auth.handler);
