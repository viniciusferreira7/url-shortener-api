import { Elysia } from 'elysia';
import z from 'zod';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeGetUrlByIdUseCase } from '@/infra/factories/make-get-url-by-id-use-case';
import { UrlPresenter } from '../../presenters/url-presenter';
import { urlSchemaResponse } from '../../utils/schemas/url-schema-response';

export const getUrlByIdController = new Elysia().get(
  '/urls/:id',
  async ({ set, params }) => {
    const useCase = makeGetUrlByIdUseCase();

    const result = await useCase.execute({
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

    return UrlPresenter.toHttp(result.value.url);
  },
  {
    detail: {
      summary: 'Get URL by ID',
      tags: ['URL'],
    },
    params: z.object({
      id: z.uuid().describe('ID of URL'),
    }),
    response: {
      200: urlSchemaResponse,
      400: z.object({
        message: z.string().describe('Bad request'),
      }),
      404: z.object({
        message: z.string().describe('Resource not found'),
      }),
    },
  }
);
