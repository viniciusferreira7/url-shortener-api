// controllers/user.controller.ts
import { Elysia } from 'elysia';
import z from 'zod';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeUnlikeUrlUseCase } from '@/infra/factories/make-unlike-url-use-case';
import { betterAuthPlugin } from '../../plugins/better-auth';

export const unlikeUrlController = new Elysia().use(betterAuthPlugin).patch(
  '/urls/:id/unlike',
  async ({ user, set, params }) => {
    const useCase = makeUnlikeUrlUseCase();

    const authorId = user.id;

    const result = await useCase.execute({
      authorId,
      urlId: params.id,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          set.status = 404;
          return { message: error.message };
        default:
          set.status = 400;
          return { message: 'Bad request' };
      }
    }

    set.status = 204;
  },
  {
    auth: true,
    detail: {
      summary: 'Unlike URL',
      tags: ['URL'],
    },
    params: z.object({
      id: z.uuid().describe('ID of URL'),
    }),
    response: {
      204: z.void(),
      400: z.object({
        message: z.string().describe('Bad request'),
      }),
      401: z.object({
        message: z.string().describe('Unauthorized'),
      }),
      404: z.object({
        message: z.string().describe('Resource not found'),
      }),
    },
  }
);
