import { Elysia } from 'elysia';
import { auth } from '@/infra/lib/auth';
import { createUrlController } from './create-url-controller';
import { deleteUrlController } from './delete-url-controller';
import { fetchUserLikedUrlsController } from './fetch-user-liked-urls-controller';
import { fetchUserUrlsController } from './fetch-user-urls-controller';
import { getUrlByIdController } from './get-url-by-id-controller';
import { likeUrlController } from './like-url-controller';
import { unlikeUrlController } from './unlike-url-controller';
import { updateUrlController } from './update-url-controller';

export const authControllers = new Elysia()
  .use(createUrlController)
  .use(deleteUrlController)
  .use(fetchUserLikedUrlsController)
  .use(fetchUserUrlsController)
  .use(getUrlByIdController)
  .use(likeUrlController)
  .use(unlikeUrlController)
  .use(updateUrlController)
  .mount(auth.handler);
