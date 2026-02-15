import { describe, expect, test } from 'bun:test';
import { treaty } from '@elysiajs/eden';
import { app } from '@/infra';
import { env } from '@/infra/env';

describe('Health controller E2E', () => {
  const client = treaty(app);

  test('[GET]: /api/public/healthz ', async () => {
    const { status, data } = await client.api.public.healthz.get({});

    expect(status).toBe(200);
    expect(data?.message).toBe('Ok');
  });

  test('[GET]: /api/public/readyz ', async () => {
    const apiToken = env.API_KEY;

    const { status, data } = await client.api.public.readyz.get({
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    expect(status).toBe(200);
    expect(data?.services).toEqual(
      expect.objectContaining({
        redis: true,
        db: true,
      })
    );
  });
});
