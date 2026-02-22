// controllers/user.controller.ts
import { Elysia } from 'elysia';
import z from 'zod';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeUpdateUrlUseCase } from '@/infra/factories/make-update-url-use-case';
import { betterAuthPlugin } from '../../plugins/better-auth';
import { UrlPresenter } from '../../presenters/url-presenter';
import { urlSchemaResponse } from '../../utils/schemas/url-schema-response';

export const updateUrlController = new Elysia().use(betterAuthPlugin).put(
  '/urls/:id',
  async ({ user, body, set, params }) => {
    const useCase = makeUpdateUrlUseCase();

    const authorId = user.id;

    const result = await useCase.execute({
      urlId: params.id,
      authorId,
      name: body.name,
      description: body.description,
      destinationUrl: body.destination_url,
      isPublic: body.is_public,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          set.status = 404;
          return { message: error.message };

        case NotAllowedError:
          set.status = 405;
          return { message: error.message };

        default:
          set.status = 400;
          return { message: 'Bad request' };
      }
    }

    const { url } = result.value;

    set.status = 200;

    return UrlPresenter.toHttp(url);
  },
  {
    auth: true,
    detail: {
      summary: 'Update URL',
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
    body: z.object({
      name: z.string().describe('Name of URL'),
      description: z.string().describe('Description of URL').nullish(),
      is_public: z
        .boolean()
        .describe(
          'If set with true value URL can be viewed by another users, otherwise only author can see the URL'
        ),
      destination_url: z.url().describe('Destination URL is original URL'),
    }),
  }
);
