// controllers/user.controller.ts
import { Elysia } from 'elysia';
import z from 'zod';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeDeleteUrlUseCase } from '@/infra/factories/make-delete-url-use-case';
import { betterAuthPlugin } from '../../plugins/better-auth';
import { UrlPresenter } from '../../presenters/url-presenter';

export const createUrlController = new Elysia().use(betterAuthPlugin).delete(
  '/urls/:id',
  async ({ user, set, params }) => {
    const useCase = makeDeleteUrlUseCase();

    const authorId = user.id;

    const result = await useCase.execute({
      authorId,
      urlId: params.id,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          set.status = 405;

          return { message: error.message };
        case ResourceNotFoundError:
          set.status = 404;
          return { message: error.message };
        default:
          set.status = 400;
          return { message: 'Bad request' };
      }
    }

    const { url } = result.value;

    set.status = 201;

    return UrlPresenter.toHttp(url);
  },
  {
    auth: true,
    detail: {
      summary: 'Delete URL',
      tags: ['URL'],
    },
    response: {
      204: z.object({
        message: z.string().describe('URL deleted successfully'),
      }),
      400: z.object({
        message: z.string().describe('Bad request'),
      }),
      404: z.object({
        message: z.string().describe('Resource not found'),
      }),
      401: z.object({
        message: z.string().describe('Unauthorized'),
      }),
      405: z.object({
        message: z.string().describe('Not allowed'),
      }),
    },
    params: z.object({
      id: z.string().describe('ID of URL'),
    }),
  }
);
