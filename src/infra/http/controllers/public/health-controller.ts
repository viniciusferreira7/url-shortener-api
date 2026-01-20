import Elysia from 'elysia';
import z from 'zod';
import { drizzleDb } from '@/infra/db/drizzle/client';
import { redisClient } from '@/infra/db/redis/client';

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
        tags: ['health'],
      },
      response: {
        200: z.object({
          message: z.string(),
        }),
      },
    }
  )
  .get(
    '/readyz',
    async ({ set }) => {
      set.status = 200;

      try {
        const [redisResponse, _drizzleResponse] = await Promise.all([
          redisClient.ping(),
          drizzleDb.execute('select 1'),
        ]);

        if (redisResponse !== 'PONG') {
          set.status = 503;

          return { message: 'Service is unavailable' };
        }
      } catch (_error) {
        return { message: 'Service is unavailable' };
      }

      return { message: 'ok' };
    },
    {
      detail: {
        summary: 'Ready check',
        tags: ['health'],
      },
      response: {
        200: z.object({
          message: z.string(),
        }),
      },
    }
  );
