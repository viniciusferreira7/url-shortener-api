import { Elysia } from 'elysia';
import z from 'zod';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeGetUrlByCodeUseCase } from '@/infra/factories/make-get-url-by-code-use-case';

export const getUrlByCodeController = new Elysia().get(
  '/:code',
  async ({ set, params, redirect }) => {
    const useCase = makeGetUrlByCodeUseCase();

    const result = await useCase.execute({
      code: params.code,
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

    return redirect(result.value.url.destinationUrl, 302);
  },
  {
    detail: {
      summary: 'Redirect to destination URL by short code (Public)',
      tags: ['URL'],
    },
    params: z.object({
      code: z.string().describe('Short code of the URL'),
    }),
    response: {
      302: z.void().describe('Redirect to destination URL'),
      400: z.object({
        message: z.string().describe('Bad request'),
      }),
      404: z.object({
        message: z.string().describe('Resource not found'),
      }),
    },
  }
);
