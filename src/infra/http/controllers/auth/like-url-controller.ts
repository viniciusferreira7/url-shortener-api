// controllers/user.controller.ts
import { Elysia } from 'elysia';
import z from 'zod';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UrlAlreadyLikedError } from '@/domain/url-shortening/errors/url-already-liked-error';
import { makeLikeUrlUseCase } from '@/infra/factories/make-like-url-use-case';
import { betterAuthPlugin } from '../../plugins/better-auth';

export const likeUrlController = new Elysia().use(betterAuthPlugin).patch(
  '/urls/:id/like',
  async ({ user, set, params }) => {
    const useCase = makeLikeUrlUseCase();

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
        case UrlAlreadyLikedError:
          set.status = 400;
          return { message: error.message };
        case NotAllowedError:
          set.status = 405;
          return { message: error.message };

        default:
          set.status = 500;
          return { message: 'Internal Server Error' };
      }
    }

    set.status = 204;
  },
  {
    auth: true,
    detail: {
      summary: 'Like URL',
      tags: ['URL'],
    },
    params: z.object({
      id: z.uuid().describe('ID of URL'),
    }),
    response: {
      204: z.void(),
      400: z.object({
        message: z.string().describe('Url already liked'),
      }),
      401: z.object({
        message: z.string().describe('Unauthorized'),
      }),
      404: z.object({
        message: z.string().describe('Resource not found'),
      }),
      405: z.object({
        message: z.string().describe('Not allowed'),
      }),
    },
  }
);
