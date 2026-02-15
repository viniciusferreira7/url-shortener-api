import { Elysia } from 'elysia';
import z from 'zod';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeFetchUserUrlsUseCase } from '@/infra/factories/make-fetch-user-urls-use-case';
import { betterAuthPlugin } from '../../plugins/better-auth';
import { PaginationPresenter } from '../../presenters/pagination-presenter';
import { UrlPresenter } from '../../presenters/url-presenter';
import { dateGteSchema } from '../../utils/schemas/date-gte-schema';
import { orderSchema } from '../../utils/schemas/order-schema';
import { paginationSchema } from '../../utils/schemas/pagination-schema';
import { urlSchemaResponse } from '../../utils/schemas/url-schema-response';

export const fetchUserUrlsController = new Elysia().use(betterAuthPlugin).get(
  '/urls/me',
  async ({ user, set, query }) => {
    const useCase = makeFetchUserUrlsUseCase();

    const result = await useCase.execute({
      authorId: user.id,
      params: {
        page: query?.page,
        perPage: query?.per_page,
        search: query?.search,
        isPublic: query?.is_public,
        createdAtGte: query?.created_at_gte,
        updatedAtGte: query?.updated_at_gte,
        order: query?.order,
      },
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

    const pagination = PaginationPresenter.toHttp(
      result.value,
      UrlPresenter.toHttp
    );

    return pagination;
  },
  {
    auth: true,
    detail: {
      summary: 'Fetch user URLs',
      tags: ['URL'],
    },
    query: z.object({
      search: z
        .string()
        .optional()
        .describe('Text used to filter results by name or keywords'),
      page: z.coerce
        .number()
        .default(1)
        .describe('Page number for paginated results (starts at 1)'),
      order: orderSchema,
      per_page: z.coerce
        .number()
        .default(10)
        .describe('Number of items returned per page'),
      is_public: z.coerce
        .boolean()
        .optional()
        .describe('Filter by public or private URLs'),
      created_at_gte: dateGteSchema
        .optional()
        .describe(
          'Filter records created on or after this date (format: yyyy-mm-dd)'
        ),
      updated_at_gte: dateGteSchema
        .optional()
        .describe(
          'Filter records updated on or after this date (format: yyyy-mm-dd)'
        ),
    }),
    response: {
      200: paginationSchema(urlSchemaResponse),
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
