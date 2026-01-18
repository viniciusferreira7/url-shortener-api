// controllers/user.controller.ts
import { Elysia } from 'elysia';
import { betterAuthPlugin } from '../../plugins/better-auth';

export const createUrlController = new Elysia().use(betterAuthPlugin).post(
  '/urls',
  () => {
    //TODO: finish the route
    return '';
  },
  {
    auth: true,
    detail: {
      summary: 'Create URL',
      tags: ['URL'],
    },
  }
);
