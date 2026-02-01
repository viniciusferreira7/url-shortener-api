// controllers/user.controller.ts
import { Elysia } from 'elysia';
import z from 'zod';
import { makeCreateUrlUseCase } from '@/infra/factories/make-create-url-use-case';
import { urlSchemaResponse } from '../../docs/schemas/url-schema-response';
import { betterAuthPlugin } from '../../plugins/better-auth';
import { UrlPresenter } from '../../presenters/url-presenter';

export const createUrlController = new Elysia().use(betterAuthPlugin).post(
  '/urls',
  async ({ user, body, set }) => {
    const useCase = makeCreateUrlUseCase();

    const authorId = user.id;

    const result = await useCase.execute({
      authorId,
      name: body.name,
      description: body.description,
      destinationUrl: body.destination_url,
      isPublic: body.is_public,
    });

    if (result.isLeft()) {
      const error = result.value;

      set.status = 400;
      return { message: error.message };
    }

    const { url } = result.value;

    set.status = 201;

    return UrlPresenter.toHttp(url);
  },
  {
    auth: true,
    detail: {
      summary: 'Create URL',
      tags: ['URL'],
    },
    response: {
      201: urlSchemaResponse,
      404: z.object({
        message: z.string().describe('Resource not found'),
      }),
      401: z.object({
        message: z.string().describe('Unauthorized'),
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
