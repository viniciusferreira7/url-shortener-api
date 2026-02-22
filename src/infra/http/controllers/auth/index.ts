import { Elysia } from 'elysia';
import { auth } from '@/infra/lib/auth';
import { createUrlController } from './create-url-controller';
import { deleteUrlController } from './delete-url-controller';
import { fetchUserLikedUrlsController } from './fetch-user-liked-urls-controller';
import { fetchUserUrlsController } from './fetch-user-urls-controller';
import { getUrlByIdController } from './get-url-by-id-controller';

export const authControllers = new Elysia()
  .use(createUrlController)
  .use(deleteUrlController)
  .use(fetchUserLikedUrlsController)
  .use(fetchUserUrlsController)
  .use(getUrlByIdController)
  .mount(auth.handler);
