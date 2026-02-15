import { beforeAll, describe, expect, test } from 'bun:test';
import { treaty } from '@elysiajs/eden';
import { faker } from '@faker-js/faker';
import { app } from '@/infra';
import { env } from '@/infra/env';
import { createAuthenticatedUser } from '@/test/e2e/auth-helpers';

describe('Fetch many public URLs controller E2E', () => {
  const client = treaty(app);
  const apiToken = env.API_KEY;

  beforeAll(async () => {
    const { sessionHeaders } = await createAuthenticatedUser();

    for (let i = 0; i < 5; i++) {
      await client.api.urls.post(
        {
          name: `Test URL ${i + 1}`,
          description: faker.lorem.sentence(),
          is_public: true,
          destination_url: faker.internet.url(),
        },
        {
          headers: sessionHeaders,
        }
      );
    }
  });

  test('[GET]: /api/public/urls - should fetch public URLs when authenticated with API key', async () => {
    const { status, data } = await client.api.public.urls.get({
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
      query: {
        page: 1,
        per_page: 10,
      },
    });

    expect(status).toBe(200);
    expect(data).toBeDefined();

    if (data && 'result' in data) {
      expect(data.page).toBeDefined();
      expect(data.total_pages).toBeDefined();
      expect(data.per_page).toBeDefined();
      expect(data.result).toBeArray();
    }
  });

  test('[GET]: /api/public/urls - should return 401 when not authenticated', async () => {
    const { status, error } = await client.api.public.urls.get({
      query: {
        page: 1,
        per_page: 10,
      },
    });

    expect(status).toBe(401);
    expect(error).toBeDefined();
  });

  test('[GET]: /api/public/urls - should support pagination parameters', async () => {
    const { status, data } = await client.api.public.urls.get({
      query: {
        page: 1,
        per_page: 3,
      },
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    expect(status).toBe(200);
    expect(data).toBeDefined();

    if (data && 'result' in data) {
      expect(data.page).toBe(1);
      expect(data.per_page).toBe(3);
      expect(data.result.length).toBeLessThanOrEqual(3);
    }
  });

  test('[GET]: /api/public/urls - should support search parameter', async () => {
    const { status, data } = await client.api.public.urls.get({
      query: {
        search: 'Test URL',
        page: 1,
        per_page: 10,
      },
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    expect(status).toBe(200);
    expect(data).toBeDefined();

    if (data && 'result' in data) {
      expect(data.result).toBeArray();
    }
  });

  test('[GET]: /api/public/urls - should support order parameter', async () => {
    const { status, data } = await client.api.public.urls.get({
      query: {
        order: '-created_at',
        page: 1,
        per_page: 10,
      },
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    expect(status).toBe(200);
    expect(data).toBeDefined();
  });

  test('[GET]: /api/public/urls - should support created_at_gte filter', async () => {
    const today = new Date().toISOString().split('T')[0];

    const { status, data } = await client.api.public.urls.get({
      query: {
        created_at_gte: today,
        page: 1,
        per_page: 10,
      },
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    expect(status).toBe(200);
    expect(data).toBeDefined();
  });

  test('[GET]: /api/public/urls - should support updated_at_gte filter', async () => {
    const today = new Date().toISOString().split('T')[0];

    const { status, data } = await client.api.public.urls.get({
      query: {
        updated_at_gte: today,
        page: 1,
        per_page: 10,
      },
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    expect(status).toBe(200);
    expect(data).toBeDefined();
  });

  test('[GET]: /api/public/urls - should return url with author information', async () => {
    const { status, data } = await client.api.public.urls.get({
      query: {
        per_page: 1,
        page: 1,
      },
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    expect(status).toBe(200);

    if (data && 'result' in data && data.result.length > 0) {
      const url = data.result[0];
      expect(url).toHaveProperty('id');
      expect(url).toHaveProperty('name');
      expect(url).toHaveProperty('destination_url');
      expect(url).toHaveProperty('author');

      if ('author' in url && url.author) {
        expect(url.author).toHaveProperty('id');
        expect(url.author).toHaveProperty('name');
      }
    }
  });
});
