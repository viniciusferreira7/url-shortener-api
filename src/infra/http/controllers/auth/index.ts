import { Elysia } from 'elysia';
import { auth } from '@/infra/lib/auth';
import { createUrlController } from './create-url-controller';
import { deleteUrlController } from './delete-url-controller';
import { fetchUserLikedUrlsController } from './fetch-user-liked-urls-controller';

export const authControllers = new Elysia()
  .use(createUrlController)
  .use(deleteUrlController)
  .use(fetchUserLikedUrlsController)
  .mount(auth.handler);
