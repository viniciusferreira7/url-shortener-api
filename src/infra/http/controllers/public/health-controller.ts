import Elysia from 'elysia';
import z from 'zod';
import { makeCheckServicesHealthUseCase } from '@/infra/factories/make-check-services-health-use-case';

export const healthController = new Elysia()
  .get(
    '/healthz',
    ({ set }) => {
      set.status = 200;
      return { message: 'Ok' };
    },
    {
      detail: {
        summary: 'Health check',
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
    async ({ set }) => {
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
        summary: 'Ready check',
        tags: ['Health'],
      },
      response: {
        200: z.object({
          status: z.string().describe('ok'),
          services: z.object({
            redis: z.boolean().default(false),
            db: z.boolean().default(false),
          }),
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
