import Elysia from 'elysia';
import z from 'zod';
import { makeCheckServicesHealthUseCase } from '@/infra/factories/make-check-services-health-use-case';
import { jwtConfig } from '@/infra/jwt/jwt-config';

export const healthController = new Elysia()
  .use(jwtConfig)
  .get(
    '/healthz',
    ({ set }) => {
      set.status = 200;
      return { message: 'Ok' };
    },
    {
      detail: {
        summary: 'Health check (Public)',
        tags: ['Health'],
      },
      response: {
        200: z.object({
          message: z.string(),
        }),
        500: z.object({
          message: z.string().describe('Internal server error'),
        }),
      },
    }
  )
  .get(
    '/readyz',
    async ({ set, jwt, request }) => {
      const authorization = request.headers.get('authorization');

      if (!authorization || !authorization.startsWith('Bearer ')) {
        set.status = 401;
        return {
          status: 'unauthorized',
          message: 'Missing or invalid API key',
        };
      }

      const token = authorization.replace('Bearer ', '');

      try {
        const isValid = await jwt.verify(token);

        if (!isValid) {
          set.status = 401;
          return {
            status: 'unauthorized',
            message: 'Invalid API key',
          };
        }
      } catch (_error) {
        set.status = 401;
        return {
          status: 'unauthorized',
          message: 'Invalid API key',
        };
      }
      const checkServicesHealthUseCase = makeCheckServicesHealthUseCase();

      const result = await checkServicesHealthUseCase.execute();

      if (result.isRight()) {
        const { status, services } = result.value;

        if (status === 'down') {
          set.status = 503;
        }

        return { status, services };
      }

      set.status = 503;
      return {
        status: 'down',
        services: { redis: false, db: false },
      };
    },
    {
      detail: {
        summary: 'Ready check (Requires API Key)',
        tags: ['Health'],
        security: [{ bearerAuth: [] }],
      },
      response: {
        200: z.object({
          status: z.string().describe('ok'),
          services: z.object({
            redis: z.boolean().default(false),
            db: z.boolean().default(false),
          }),
        }),
        401: z.object({
          status: z.string().describe('unauthorized'),
          message: z.string().describe('API key validation error'),
        }),
        503: z.object({
          status: z.string().describe('down'),
          services: z.object({
            redis: z.boolean().default(false),
            db: z.boolean().default(false),
          }),
        }),
      },
    }
  );
