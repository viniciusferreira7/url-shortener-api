import { Elysia } from 'elysia';
import z from 'zod';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeFetchUserLikedUrlsUseCase } from '@/infra/factories/make-fetch-user-liked-urls-use-case';
import { betterAuthPlugin } from '../../plugins/better-auth';
import { UrlWithAuthorPresenter } from '../../presenters/url-with-author-presenter';
import { urlWithAuthorSchemaResponse } from '../../utils/schemas/url-with-author-schema';

export const fetchUserLikedUrlsController = new Elysia()
  .use(betterAuthPlugin)
  .get(
    '/urls/liked',
    async ({ user, set }) => {
      const useCase = makeFetchUserLikedUrlsUseCase();

      const result = await useCase.execute({
        userId: user.id,
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

      set.status = 200;

      return result.value.map(UrlWithAuthorPresenter.toHttp);
    },
    {
      auth: true,
      detail: {
        summary: 'Fetch user liked URLs',
        tags: ['URL'],
      },
      response: {
        200: z.array(urlWithAuthorSchemaResponse),
        400: z.object({
          message: z.string().describe('Bad request'),
        }),
        404: z.object({
          message: z.string().describe('Resource not found'),
        }),
        401: z.object({
          message: z.string().describe('Unauthorized'),
        }),
      },
    }
  );
