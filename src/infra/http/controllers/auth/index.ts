import { Elysia } from 'elysia';
import { auth } from '@/infra/lib/auth';
import { createUrlController } from './create-url-controller';
import { deleteUrlController } from './delete-url-controller';

export const authControllers = new Elysia()
  .use(createUrlController)
  .use(deleteUrlController)
  .mount(auth.handler);
