import { Elysia } from 'elysia';
import z from 'zod';
import { makeFetchManyPublicUrlsUseCase } from '@/infra/factories/make-fetch-many-public-urls-use-case';
import { dateGteSchema } from '@/infra/http/utils/schemas/date-gte-schema';
import { jwtAuthPlugin } from '../../../jwt/jwt-auth-plugin';
import { PaginationPresenter } from '../../presenters/pagination-presenter';
import { UrlWithAuthorPresenter } from '../../presenters/url-with-author-presenter';
import { orderSchema } from '../../utils/schemas/order-schema';
import { paginationSchema } from '../../utils/schemas/pagination-schema';
import { urlWithAuthorSchemaResponse } from '../../utils/schemas/url-with-author-schema';

export const fetchManyPublicUrlsController = new Elysia()
  .use(jwtAuthPlugin)
  .get(
    '/urls',
    async ({ set, query }) => {
      const useCase = makeFetchManyPublicUrlsUseCase();

      const result = await useCase.execute({
        search: query?.search,
        page: query?.page,
        perPage: query?.per_page,
        order: query?.order,
        createdAtGte: query?.created_at_gte,
        updatedAtGte: query?.updated_at_gte,
      });

      set.status = 200;

      if (result.isLeft()) {
        return { page: 1, total_pages: 1, per_page: 10, result: [] };
      }

      const pagination = PaginationPresenter.toHttp(
        result.value,
        UrlWithAuthorPresenter.toHttp
      );

      return pagination;
    },
    {
      auth: true,
      detail: {
        summary: 'Fetch many public URLs',
        tags: ['URL'],
        security: [{ bearerAuth: [] }],
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
        200: paginationSchema(urlWithAuthorSchemaResponse),
        401: z.object({
          status: z.string().describe('unauthorized'),
          message: z.string().describe('API key validation error'),
        }),
      },
    }
  );
